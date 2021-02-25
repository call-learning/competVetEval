import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'

import { AlertController } from '@ionic/angular'

import { Observable, throwError } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.authService.loggedUserValue) {
      if (!this.authService.currentUserRole.getValue()) {
        this.authService.updateUserRole().subscribe(
          () => null,
          (error) => {
            this.alertController
              .create({
                header: 'Choix du rôle',
                message: 'Choisissez un rôle pour la session de démonstration',
                buttons: [
                  {
                    text: 'Etudiant',
                    handler: () => {
                      this.authService.currentUserRole.next('student')
                    },
                  },
                  {
                    text: 'Évaluateur',
                    handler: () => {
                      this.authService.currentUserRole.next('appraiser')
                    },
                  },
                ],
              })
              .then((alert) => {
                alert.present()
              })
          }
        )
      }
      return true
    } else {
      this.router.navigate(['/login'])
      return false
    }
  }
}
