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
import { IdpModel } from '../../shared/models/idp.model'
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
  loggedUser$ = new BehaviorSubject<CevUser>(null)
  loginState$ = new BehaviorSubject<string>(LOGIN_STATE.ATTEMPT_TO_RECOVER)
  accessToken: string
  currentUserRole$ = new BehaviorSubject<'student' | 'appraiser'>(null)

  idpList$ = new BehaviorSubject<IdpModel[]>(null)

  constructor(
    private router: Router,
    private httpAuthService: HttpAuthService,
    private schoolsProviderService: SchoolsProviderService
  ) {}

  public login(
    username: string,
    password: string
  ): Observable<'student' | 'appraiser'> {
    this.cleanUp()
    //this.loginState$.next(LOGIN_STATE.ATTEMPT_TO_RECOVER)
    return this.httpAuthService.login(username, password).pipe(
      tap((res: LoginResult) => {
        if (res.errorcode) {
          console.error(`Erreur de connexion: (${res.errorcode})`)
          throw new Error(res.errorcode)
        }
      }),
      tap((res: LoginResult) => {
        this.setSession(res.token)
      }),
      concatMap(() => {
        return this.loadUserProfile()
      }),
      tap(() => {
        this.loginState$.next(LOGIN_STATE.LOGGED)
      })
    )
  }

  public loginWithToken(tokenString) {
    this.setSession(tokenString)
    return this.loadUserProfile().pipe(
      tap(() => {
        this.loginState$.next(LOGIN_STATE.LOGGED)
      })
    )
  }

  public logout() {
    this.router.navigate(['login'])

    this.cleanUp()

    this.loginState$.next(LOGIN_STATE.IDLE)
    this.loggedUser$.next(null)

    this.accessToken = null
    this.currentUserRole$.next(null)
  }

  public setChosenSchool(school: School) {
    if (school) {
      this.schoolsProviderService.setSelectedSchoolId(school.id)
    } else {
      this.schoolsProviderService.setSelectedSchoolId(null)
    }

    this.chosenSchool = school
  }

  public recoverSession(): Observable<boolean> {
    if (this.schoolsProviderService.getSelectedSchoolId()) {
      this.setChosenSchool(
        this.schoolsProviderService.getSchoolFromId(
          this.schoolsProviderService.getSelectedSchoolId()
        )
      )
      if (!this.chosenSchool) {
        LocaleKeys.cleanupAllLocalStorage()
        this.loginState$.next(LOGIN_STATE.IDLE)
        return of(true)
      }
    }
    if (this.variablesInSessionExists()) {
      return this.recoverStorageVariables().pipe(
        tap(() => {
          this.loginState$.next(LOGIN_STATE.LOGGED)
        }),
        catchError((err) => {
          this.logout()
          return throwError(err)
        })
      )
    } else {
      this.loginState$.next(LOGIN_STATE.IDLE)
      return of(true)
    }
  }

  public setSession(token: string) {
    this.accessToken = token
    localStorage.setItem(LocaleKeys.tokenId, this.accessToken)
  }

  public variablesInSessionExists() {
    return localStorage.getItem(LocaleKeys.tokenId)
  }

  public isStillLoggedIn() {
    return !!this.variablesInSessionExists()
  }

  public get loggedUserValue() {
    return this.loggedUser$.getValue()
  }

  public get isStudent() {
    return this.currentUserRole$.getValue() === 'student'
  }

  public get isAppraiser() {
    return this.currentUserRole$.getValue() !== 'student'
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
      })
    )
  }

  private setUserProfile(userProfile: CevUser) {
    this.loggedUser$.next(userProfile)
    localStorage.setItem(LocaleKeys.authProfile, JSON.stringify(userProfile))
  }

  private setUserRole(role: 'student' | 'appraiser') {
    this.currentUserRole$.next(role)
  }

  private cleanUp() {
    this.accessToken = null
    LocaleKeys.cleanupAuthStorage()
  }
}
