import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { ModalController, ToastController } from '@ionic/angular'

@Component({
  selector: 'app-modal-scan-appraisal',
  templateUrl: './modal-scan-appraisal.component.html',
  styleUrls: ['./modal-scan-appraisal.component.scss'],
  providers: [BarcodeScanner],
})
export class ModalScanAppraisalComponent implements OnInit {
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

        const barcodeDataSplit = barcodeData.text.split('|')
        this.router.navigate([
          'evaluate',
          barcodeDataSplit[0],
          barcodeDataSplit[1],
        ])
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
}
