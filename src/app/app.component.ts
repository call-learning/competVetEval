import { Component, NgZone, OnDestroy, OnInit } from '@angular/core'

import { Platform, ToastController } from '@ionic/angular'

import { Browser, Capacitor, Plugins } from '@capacitor/core'
import { worker } from '../mock/browser'
import { AuthService } from './core/services/auth.service'
import { EnvironmentService } from './core/services/environment.service'
import { AppState } from '@capacitor/core'
import { URLSearchParams } from 'url'
import { getTokenFromLaunchURL } from './shared/utils/helpers'
import { SchoolsProviderService } from './core/providers/schools-provider.service'
import { Router } from '@angular/router'
const { App } = Plugins

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private platform: Platform,
    public authService: AuthService,
    public schoolService: SchoolsProviderService,
    private environmentService: EnvironmentService,
    private toastController: ToastController,
    private router: Router
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
    App.addListener('appUrlOpen', (data: any) => {
      this.openWithURL(data.url)
    })
    App.getLaunchUrl().then((data) => {
      this.openWithURL(data.url)
    })
  }

  async openHelpPage() {
    // Opening a URL and returning an InAppBrowserObject
    await Browser.open({ url: this.environmentService.helpUrl })
  }

  protected openWithURL(url) {
    try {
      console.log('App opened with URL: ' + url)
      if (this.schoolService.getSelectedSchoolId()) {
        const token = getTokenFromLaunchURL(
          url,
          this.schoolService.getSelectedSchoolUrl()
        )
        if (token) {
          this.authService.loginWithToken(token).subscribe((loggedin) => {
            if (loggedin) {
              this.router.navigate(['/situations-list'])
            }
          })
        }
      } else {
        this.router.navigate(['/school-choice'])
      }
    } catch (e) {
      this.toastController
        .create({
          message: 'Erreur de login SSO:' + e.message,
          duration: 2000,
          color: 'failure',
        })
        .then((toast) => {
          toast.present()
        })
    }
  }
}
