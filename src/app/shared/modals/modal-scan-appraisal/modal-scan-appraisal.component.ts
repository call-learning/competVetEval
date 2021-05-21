/**
 * Modal for barcode scan
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { ModalController, ToastController } from '@ionic/angular'

import { AppraisalUiService } from '../../../core/services/appraisal-ui.service'
import { AuthService } from '../../../core/services/auth.service'
import { AppraisalUI } from '../../models/ui/appraisal-ui.model'

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
    private appraisalUIService: AppraisalUiService,
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
        this.appraisalUIService
          .waitForAppraisalId(Number.parseInt(barcodeDataSplit[0]))
          .subscribe((appraisal: AppraisalUI) => {
            appraisal.context = barcodeDataSplit[2]
            this.appraisalUIService
              .submitAppraisal(appraisal)
              .subscribe((appraisalid) => {
                this.router.navigate(['appraisal-edit', appraisalid])
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
