import { Component, OnInit } from '@angular/core'

import { ToastController } from '@ionic/angular'

import { AuthService } from 'src/app/core/services/auth.service'

@Component({
  selector: 'app-rotation-detail',
  templateUrl: './rotation-detail.page.html',
  styleUrls: ['./rotation-detail.page.scss'],
})
export class RotationDetailPage implements OnInit {
  rotation

  constructor(
    public authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.rotation = {
      title: 'Rotation chirurgie technique',
      subtitle: '10-14 Juillet 2020',
      evaluations: [
        {
          title: 'Philip Payne',
          responsable: true,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
        },
        {
          title: 'Philip Payne',
          responsable: false,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
        },
        {
          title: 'Philip Payne',
          responsable: false,
          date: '30/09/2020',
          image: 'https://via.placeholder.com/50x50',
        },
      ],
      status: 'done',
      student: {
        image: 'https://via.placeholder.com/50x50',
        name: 'Derrick Simmons',
      },
    }
  }

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
