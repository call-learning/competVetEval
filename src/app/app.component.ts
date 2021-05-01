import { Component } from '@angular/core'

import { Platform } from '@ionic/angular'

import { Capacitor, Plugins } from '@capacitor/core'
import { AuthService } from './core/services/auth.service'
import { EnvironmentService } from './core/services/environment.service'
import { worker } from '../mock/browser'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public authService: AuthService,
    private environmentService: EnvironmentService
  ) {
    this.initializeApp()
  }

  ngOnInit() {
    if (this.environmentService.mockServer) {
      worker.start()
    }
  }

  ngOnDestroy() {
    if (this.environmentService.mockServer) {
      worker.stop()
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide()
      }
    })
  }
}
