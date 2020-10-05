import { Component, OnInit } from '@angular/core'

import { ToastController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'

@Component({
  selector: 'app-rotation-detail',
  templateUrl: './rotation-detail.page.html',
  styleUrls: ['./rotation-detail.page.scss'],
})
export class RotationDetailPage implements OnInit {
  constructor(
    public authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  saveForLater() {
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
