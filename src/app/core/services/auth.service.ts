import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { of, throwError, BehaviorSubject } from 'rxjs'
import { catchError, concatMap, map, tap } from 'rxjs/operators'
import { LoginResult } from 'src/app/shared/models/auth.model'
import { CevUser } from 'src/app/shared/models/cev-user.model'
import { School } from 'src/app/shared/models/school.model'
import { LocaleKeys } from 'src/app/shared/utils/locale-keys'
import { HttpAuthService } from '../http-services/http-auth.service'
import { SchoolsProviderService } from '../providers/schools-provider.service'

export let LOGIN_STATE = {
  ATTEMPT_TO_RECOVER: 'ATTEMPT_TO_RECOVER',
  IDLE: 'IDLE',
  LOGGED: 'LOGGED',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  chosenSchool: School

  loggedUser = new BehaviorSubject<CevUser>(null)
  loginState = new BehaviorSubject<string>(LOGIN_STATE.ATTEMPT_TO_RECOVER)

  accessToken: string

  currentUserRole: 'student' | 'evaluator' = 'student'

  constructor(
    private router: Router,
    private schoolsProviderService: SchoolsProviderService,
    private httpAuthService: HttpAuthService
  ) {}

  login(username: string, password: string) {
    this.cleanAuthLocalStorage()
    return this.httpAuthService.login(username, password).pipe(
      tap((res) => {
        if (res.errorcode) {
          throw new Error(res.errorcode)
        }
      }),
      tap((res) => {
        this.setSession(res)
      }),
      concatMap((res) => {
        return this.loadUserProfile()
      }),
      map((resUserProfile) => {
        if (resUserProfile) {
          this.loginState.next(LOGIN_STATE.LOGGED)
          return resUserProfile
        } else {
          throw new Error('Api data is not valid')
        }
      })
    )
  }

  logout() {
    this.router.navigate(['login'])

    this.cleanAuthLocalStorage()

    this.loginState.next(LOGIN_STATE.IDLE)
    this.loggedUser.next(null)

    this.accessToken = null
  }

  setChosenSchool(school: School) {
    if (school) {
      localStorage.setItem(LocaleKeys.schoolChoiceId, school.id)
    } else {
      localStorage.setItem(LocaleKeys.schoolChoiceId, null)
    }

    this.chosenSchool = school
  }

  recoverSession() {
    if (localStorage.getItem(LocaleKeys.schoolChoiceId)) {
      this.chosenSchool = this.schoolsProviderService.getSchoolFromId(
        localStorage.getItem(LocaleKeys.schoolChoiceId)
      )
    }

    if (this.variablesInSessionExists()) {
      return this.recoverStorageVariables().pipe(
        tap((res) => {
          this.loginState.next(LOGIN_STATE.LOGGED)
        }),
        catchError((err) => {
          this.logout()
          return throwError(err)
        })
      )
    } else {
      this.loginState.next(LOGIN_STATE.IDLE)
      return of(true)
    }
  }

  private setSession(loginResult: LoginResult) {
    this.accessToken = loginResult.token
    localStorage.setItem(LocaleKeys.tokenId, this.accessToken)
  }

  variablesInSessionExists() {
    return localStorage.getItem(LocaleKeys.tokenId)
  }

  isStillLoggedIn() {
    this.variablesInSessionExists()
  }

  private recoverStorageVariables() {
    this.accessToken = localStorage.getItem(LocaleKeys.tokenId)
    return this.loadUserProfile().pipe(
      map((res) => {
        if (res) {
          return true
        } else {
          return false
        }
      })
    )
  }

  updateUser() {
    this.loadUserProfile().subscribe()
  }

  private loadUserProfile() {
    return this.httpAuthService.getUserProfile().pipe(
      map((res) => {
        if (res) {
          this.setUserProfile(res)
          return res
        } else {
          throw new Error('Api data is not valid')
        }
      })
    )
  }

  private setUserProfile(userProfile: CevUser) {
    this.loggedUser.next(userProfile)
    localStorage.setItem(LocaleKeys.authProfile, JSON.stringify(userProfile))
  }

  private cleanAuthLocalStorage() {
    this.accessToken = null

    localStorage.removeItem(LocaleKeys.tokenId)
    localStorage.removeItem(LocaleKeys.authProfile)
  }

  get loggedUserValue() {
    return this.loggedUser.getValue()
  }

  get isStudentMode() {
    return this.currentUserRole === 'student'
  }

  get isEvaluatorMode() {
    return this.currentUserRole === 'evaluator'
  }
}
