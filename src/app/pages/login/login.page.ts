import { HttpAuthService } from './../../core/http-services/http-auth.service'
/**
 * Login page
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { LoadingController } from '@ionic/angular'

import { finalize } from 'rxjs/operators'
import { AuthService } from 'src/app/core/services/auth.service'
import { EncryptService } from 'src/app/core/services/encrypt.service'
import { LocaleKeys } from 'src/app/shared/utils/locale-keys'
import { IdpModel } from 'src/app/shared/models/idp.model'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup

  errorMsg = ''
  isLoading = false

  idpList: IdpModel[] = null

  formSubmitted = false

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private encryptService: EncryptService,
    private httpAuthService: HttpAuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  ionViewDidEnter() {
    this.prefillLoginForm()

    this.httpAuthService.getIdps().subscribe((idpList) => {
      this.idpList = idpList
    })
  }

  ionViewDidLeave() {
    this.loginForm.markAsUntouched()
    this.loginForm.reset()
  }

  prefillLoginForm() {
    if (localStorage.getItem(LocaleKeys.rememberMeUsername)) {
      const rememberedUsername = localStorage.getItem(
        LocaleKeys.rememberMeUsername
      )
      this.loginForm.get('username').setValue(rememberedUsername)
    }

    if (localStorage.getItem(LocaleKeys.rememberMePassword)) {
      try {
        const rememberedPassword = this.encryptService.decrypt(
          localStorage.getItem(LocaleKeys.rememberMePassword)
        )
        this.loginForm.get('password').setValue(rememberedPassword)
      } catch {
        console.error(
          'crpyto error, encrypted password is',
          localStorage.getItem(LocaleKeys.rememberMePassword)
        )
      }
    }
  }

  login() {
    if (!this.isLoading) {
      this.errorMsg = ''
      this.formSubmitted = true

      if (this.loginForm.valid) {
        this.loadingController.create().then((loader) => {
          loader.present()
          this.isLoading = true

          this.authService
            .login(this.loginForm.value.username, this.loginForm.value.password)
            .pipe(
              finalize(() => {
                this.isLoading = false
                loader.dismiss()
              })
            )
            .subscribe(
              () => {
                this.saveLoginForm()
                this.router.navigate(['/situations-list'])
              },
              (err: Error) => {
                if (err.message === 'invalidlogin') {
                  this.errorMsg = 'Identifiants invalides'
                } else {
                  this.errorMsg = `Une erreur s'est produite (${err.name})`
                }
              }
            )
        })
      } else {
        this.errorMsg = 'Le formulaire est invalide'
      }
    }
  }

  goToSchoolChoice() {
    this.authService.setChosenSchool(null)
    this.router.navigate(['/school-choice'])
  }

  launchIdp(idpURL) {
    window.open(idpURL, '_system')
    if ((<any>navigator).app) {
      ;(<any>navigator).app.exitApp()
    }
  }

  saveLoginForm() {
    localStorage.setItem(
      LocaleKeys.rememberMeUsername,
      this.loginForm.value.username
    )
    localStorage.setItem(
      LocaleKeys.rememberMePassword,
      this.encryptService.encrypt(this.loginForm.value.password)
    )
  }
}
