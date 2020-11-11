import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { LoadingController, ToastController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup

  errorMsg = ''
  loader: HTMLIonLoadingElement
  isLoading = false

  formSubmitted = false

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    this.loadingController.create().then((res) => {
      this.loader = res
    })
  }

  login() {
    if (!this.isLoading) {
      this.errorMsg = ''
      this.formSubmitted = true

      if (this.loginForm.valid) {
        this.loader.present()
        this.isLoading = true

        this.authService
          .login(this.loginForm.value.username, this.loginForm.value.password)
          .subscribe(
            (res) => {
              this.router.navigate(['/rotations-list'])
              this.loader.dismiss()
              this.isLoading = false
            },
            (err: Error) => {
              if (err.message === 'invalidlogin') {
                this.errorMsg = 'Identifiants invalides'
              } else {
                this.errorMsg = `Une erreur s'est produite`
              }

              this.loader.dismiss()
              this.isLoading = false
            }
          )
      } else {
        this.errorMsg = 'Le formulaire est invalide'
        this.loader.dismiss()
        this.isLoading = false
      }
    }
  }

  goToSchoolChoice() {
    this.authService.setChosenSchool(null)
    this.router.navigate(['/school-choice'])
  }

  notImplemented() {
    this.toastController
      .create({
        message: 'Not implemented',
        duration: 2000,
        color: 'danger',
      })
      .then((toast) => {
        toast.present()
      })
  }
}
