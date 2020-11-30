import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { ModalController, ToastController } from '@ionic/angular'

@Component({
  selector: 'app-modal-scan-evaluation',
  templateUrl: './modal-scan-evaluation.component.html',
  styleUrls: ['./modal-scan-evaluation.component.scss'],
  providers: [BarcodeScanner],
})
export class ModalScanEvaluationComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private barcodeScanner: BarcodeScanner,
    private router: Router
  ) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }

  scanQRCode() {
    this.barcodeScanner
      .scan({
        preferFrontCamera: false,
        showFlipCameraButton: true,
        showTorchButton: true,
        torchOn: false,
        prompt: 'Scannez le QR code présenté par l’étudiant',
        resultDisplayDuration: 500,
        formats: 'QR_CODE',
      })
      .then((barcodeData) => {
        this.toastController
          .create({
            message: 'Scan réussi !',
            duration: 2000,
            color: 'success',
          })
          .then((toast) => {
            toast.present()
          })
        this.dismissModal()
        this.router.navigate(['evaluate', barcodeData.text])
      })
      .catch((err) => {
        console.error('Error', err)
        this.toastController
          .create({
            message: 'Erreur lors du scan',
            duration: 2000,
            color: 'danger',
          })
          .then((toast) => {
            toast.present()
          })
      })
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
