import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

import { of, throwError, BehaviorSubject } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { CevUser } from 'src/app/shared/models/cev-user.model'
import { School } from 'src/app/shared/models/school.model'
import { LocaleKeys } from 'src/app/shared/utils/locale-keys'
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
  refreshToken: string

  constructor(
    private router: Router,
    private schoolsProviderService: SchoolsProviderService
  ) {}

  login(username: string, password: string) {
    // this.cleanAuthLocalStorage();
    // return this.httpUserService.login(username, password).pipe(
    //   tap((res) => {
    //     this.setSession(res);
    //   }),
    //   concatMap((res) => {
    //     return this.loadUserProfile();
    //   }),
    //   map((resUserProfile) => {
    //     if (resUserProfile) {
    //       this.loginState.next(LOGIN_STATE.LOGGED);
    //       return resUserProfile;
    //     } else {
    //       throw new Error('Api data is not valid');
    //     }
    //   })
    // );
  }

  logout() {
    this.router.navigate(['login'])

    this.cleanAuthLocalStorage()

    this.loginState.next(LOGIN_STATE.IDLE)
    this.loggedUser.next(null)

    this.accessToken = null
    this.refreshToken = null
  }

  register() {
    // return this.httpUserService.register(registerCredentials).pipe(
    //   map((res) => {
    //     if (!res || !res.message) {
    //       throw new Error('Api data is not valid');
    //     } else {
    //       return res;
    //     }
    //   })
    // );
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

  // private setSession() {
  // this.accessToken = loginResult.access_token;
  // localStorage.setItem(LocaleKeys.tokenId, this.accessToken);

  // this.refreshToken = loginResult.refresh_token;
  // localStorage.setItem(LocaleKeys.refreshTokenId, this.refreshToken);

  // const expiresAt = (loginResult.expires_in * 1000 + new Date().getTime()).toString();
  // localStorage.setItem(LocaleKeys.tokenExpiresAt, expiresAt);
  // }

  variablesInSessionExists() {
    return false
    // return (
    //   localStorage.getItem(LocaleKeys.tokenExpiresAt) &&
    //   localStorage.getItem(LocaleKeys.tokenId) &&
    //   localStorage.getItem(LocaleKeys.refreshTokenId)
    // );
  }

  isStillLoggedIn() {
    return false
    // const expiresAt = parseInt(localStorage.getItem(LocaleKeys.tokenExpiresAt), 10);

    // if (!expiresAt) {
    //   return false;
    // } else {
    //   return Date.now() < expiresAt && this.variablesInSessionExists();
    // }
  }

  private recoverStorageVariables() {
    // this.accessToken = localStorage.getItem(LocaleKeys.tokenId);
    // this.refreshToken = localStorage.getItem(LocaleKeys.refreshTokenId);
    // return this.loadUserProfile().pipe(
    //   map((res) => {
    //     if (res) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   })
    // );
    return of(false)
  }

  refreshAuthToken() {
    // return this.httpUserService.refreshAuthToken(this.refreshToken).pipe(
    //   tap((authResult) => {
    //     this.setSession(authResult);
    //   }),
    //   catchError((error) => {
    //     this.logout();
    //     return throwError(error);
    //   })
    // );
  }

  updateUser() {
    this.loadUserProfile().subscribe()
  }

  private loadUserProfile() {
    // return this.httpUserService.getUserProfile().pipe(
    //   map((res) => {
    //     if (res && res.user) {
    //       this.setUserProfile(res.user);
    //       return res.user;
    //     } else {
    //       throw new Error('Api data is not valid');
    //     }
    //   })
    // );
    return of(true)
  }

  // private setUserProfile(userProfile: CevUser) {
  // this.loggedUser.next(userProfile);
  // localStorage.setItem(LocaleKeys.authProfile, JSON.stringify(userProfile));
  // }

  private cleanAuthLocalStorage() {
    this.accessToken = null
    this.refreshToken = null
    // localStorage.removeItem(LocaleKeys.tokenId);
    // localStorage.removeItem(LocaleKeys.refreshTokenId);
    // localStorage.removeItem(LocaleKeys.tokenExpiresAt);
    // localStorage.removeItem(LocaleKeys.authProfile);
  }

  get loggedUserValue() {
    return this.loggedUser.getValue()
  }
}
