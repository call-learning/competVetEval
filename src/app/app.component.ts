import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'

import { Capacitor, Plugins } from '@capacitor/core'
import { AuthService } from './core/services/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, public authService: AuthService) {
    this.initializeApp()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide()
      }
    })
  }

  toggleUserRole() {
    if (this.authService.isStudentMode) {
      this.authService.currentUserRole = 'evaluator'
    } else if (this.authService.isEvaluatorMode) {
      this.authService.currentUserRole = 'student'
    }
  }
}
