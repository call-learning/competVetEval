/**
 * Auth service file
 *
 * Manage authentication and user role
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { of, throwError, BehaviorSubject, Observable } from 'rxjs'
import { catchError, concatMap, map, tap } from 'rxjs/operators'
import { School } from 'src/app/shared/models/school.model'
import { LoginResult } from '../../shared/models/auth.model'
import { CevUser } from '../../shared/models/cev-user.model'
import { LocaleKeys } from '../../shared/utils/locale-keys'
import { HttpAuthService } from '../http-services/http-auth.service'
import { SchoolsProviderService } from '../providers/schools-provider.service'

export const LOGIN_STATE = {
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
  currentUserRole = new BehaviorSubject<'student' | 'appraiser'>(null)

  constructor(
    private router: Router,
    private httpAuthService: HttpAuthService,
    private schoolsProviderService: SchoolsProviderService
  ) {}

  login(
    username: string,
    password: string
  ): Observable<'student' | 'appraiser'> {
    this.cleanUp()
    return this.httpAuthService.login(username, password).pipe(
      tap((res: LoginResult) => {
        if (res.errorcode) {
          console.error(`Erreur de connexion: (${res.errorcode})`)
          throw new Error(res.errorcode)
        }
      }),
      tap((res) => {
        this.setSession(res)
      }),
      concatMap(() => {
        return this.loadUserProfile()
      }),
      tap(() => {
        this.loginState.next(LOGIN_STATE.LOGGED)
      })
    )
  }

  logout() {
    this.router.navigate(['login'])

    this.cleanUp()

    this.loginState.next(LOGIN_STATE.IDLE)
    this.loggedUser.next(null)

    this.accessToken = null
    this.currentUserRole.next(null)
  }

  setChosenSchool(school: School) {
    if (school) {
      this.schoolsProviderService.setSelectedSchoolId(school.id)
    } else {
      this.schoolsProviderService.setSelectedSchoolId(null)
    }

    this.chosenSchool = school
  }

  recoverSession() {
    if (this.schoolsProviderService.getSelectedSchoolId()) {
      this.chosenSchool = this.schoolsProviderService.getSchoolFromId(
        this.schoolsProviderService.getSelectedSchoolId()
      )
      if (!this.chosenSchool) {
        LocaleKeys.cleanupAllLocalStorage()
        this.loginState.next(LOGIN_STATE.IDLE)
        return of(true)
      }
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
    return !!this.variablesInSessionExists()
  }

  private recoverStorageVariables() {
    this.accessToken = localStorage.getItem(LocaleKeys.tokenId)
    return this.loadUserProfile().pipe(
      map((res) => {
        return true
      })
    )
  }

  private loadUserProfile(): Observable<'student' | 'appraiser'> {
    return this.httpAuthService.getUserProfile().pipe(
      map((user: CevUser) => {
        if (user) {
          this.setUserProfile(user)
          return user
        } else {
          throw new Error('Api data is not valid')
        }
      }),
      concatMap((user) => {
        return this.httpAuthService.getUserType(user.userid)
      }),
      tap((role: 'student' | 'appraiser') => {
        this.setUserRole(role)
      }),
      catchError((err) => {
        return throwError(err)
      })
    )
  }

  private setUserProfile(userProfile: CevUser) {
    this.loggedUser.next(userProfile)
    localStorage.setItem(LocaleKeys.authProfile, JSON.stringify(userProfile))
  }

  private setUserRole(role: 'student' | 'appraiser') {
    this.currentUserRole.next(role)
  }

  private cleanUp() {
    this.accessToken = null
    LocaleKeys.cleanupAuthStorage()
  }

  get loggedUserValue() {
    return this.loggedUser.getValue()
  }

  get isStudent() {
    return this.currentUserRole.getValue() === 'student'
  }

  get isAppraiser() {
    return this.currentUserRole.getValue() === 'appraiser'
  }
}
