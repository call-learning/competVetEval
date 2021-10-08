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
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular'

import { filter, first } from 'rxjs/operators'
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
    private router: Router,
    private loadingController: LoadingController
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
        const appraisalId = Number.parseInt(barcodeData.text, 10)

        this.loadingController.create().then((loader) => {
          loader.present()

          const REFRESH_TIMEOUT = 30000 // If after 30 sec we have no refresh even
          // we stop the spinner. This happens mostly when the appraiser is not linked
          // to the student.
          let loaderDismissed = false
          const refresh = this.appraisalUIService
            .waitForAppraisalId(appraisalId, true)
            .pipe(
              filter(
                (appraisal) => appraisal !== null && appraisal !== undefined
              ),
              first()
            )
            .subscribe((appraisal: AppraisalUI) => {
              loader.dismiss().then(() => {
                loaderDismissed = true
              })

              if (appraisal.appraiser !== null) {
                this.toastController
                  .create({
                    message:
                      'Cette observation a déjà été assignée à un autre évaluateur',
                    duration: 2000,
                    color: 'danger',
                  })
                  .then((toast) => {
                    toast.present()
                  })
              } else {
                appraisal.appraiser = this.authService.loggedUserValue

                this.appraisalUIService
                  .submitAppraisal(appraisal)
                  .subscribe((appraisalid) => {
                    this.router.navigate(['appraisal-edit', appraisalid])
                  })
              }
            })

          setTimeout(() => {
            console.warn('Scan cancelled')
            if (!loaderDismissed) {
              loader.dismiss()
              this.toastController
                .create({
                  message:
                    "L'observation n'a pas pu être récupérée, pourriez-vous " +
                    'vérifier que vous êtes bien dans la liste des observateurs de cet étudiant?',
                  duration: 2000,
                  color: 'warning',
                })
                .then((toast) => {
                  toast.present()
                })
              refresh.unsubscribe()
            }
          }, REFRESH_TIMEOUT)
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
