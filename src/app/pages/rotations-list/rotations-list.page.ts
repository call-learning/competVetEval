import { Component, OnInit } from '@angular/core'

import { MenuController, ToastController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'

@Component({
  selector: 'app-rotations-list',
  templateUrl: './rotations-list.page.html',
  styleUrls: ['./rotations-list.page.scss'],
})
export class RotationsListPage implements OnInit {
  constructor(
    private toastController: ToastController,
    private menuController: MenuController,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  openMenu() {
    this.menuController.open('main')
  }

  filterRotations() {
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
