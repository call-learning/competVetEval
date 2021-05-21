import { Component, OnDestroy, OnInit } from '@angular/core'

import { Platform } from '@ionic/angular'

import { Browser, Capacitor, Plugins } from '@capacitor/core'
import { worker } from '../mock/browser'
import { AuthService } from './core/services/auth.service'
import { EnvironmentService } from './core/services/environment.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
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
  async openHelpPage() {
    // Opening a URL and returning an InAppBrowserObject
    await Browser.open({ url: this.environmentService.helpUrl })
  }
}
