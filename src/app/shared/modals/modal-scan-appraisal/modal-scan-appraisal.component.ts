import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { ModalController, ToastController } from '@ionic/angular'
import { Appraisal } from '../../models/appraisal.model'
import { AppraisalService } from '../../../core/services/appraisal.service'
import { AuthService } from '../../../core/services/auth.service'

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
    private appraisalService: AppraisalService,
    private authService: AuthService,
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
        this.appraisalService
          .createBlankAppraisal(
            barcodeDataSplit[0],
            barcodeDataSplit[1],
            this.authService.loggedUser.getValue().userid
          )
          .subscribe((appraisal: Appraisal) => {
            appraisal.context = barcodeDataSplit[2]
            this.appraisalService
              .submitAppraisal(appraisal)
              .subscribe((appraisal) => {
                this.router.navigate(['appraisal-edit', appraisal.id])
              })
          })
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
