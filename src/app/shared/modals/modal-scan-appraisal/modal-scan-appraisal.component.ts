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
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular'

import { AppraisalUiService } from '../../../core/services/appraisal-ui.service'
import { AuthService } from '../../../core/services/auth.service'
import { AppraisalUI } from '../../models/ui/appraisal-ui.model'
import { map, tap } from 'rxjs/operators'
import appr from '../../../../mock/fixtures/appr'

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
    private loadingController: LoadingController,
    private alertController: AlertController
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
      .then((barcodeData) => this.processScan(barcodeData))
      .catch((err) => {
        if (err == 'cordova_not_available') {
          this.alertController
            .create({
              inputs: [
                {
                  name: 'appraisalid',
                  placeholder: "Code de l'évaluation",
                },
              ],
              buttons: [
                {
                  text: 'Ok',
                  handler: (data) => {
                    this.showAppraisal(Number.parseInt(data.appraisalid))
                  },
                },
              ],
            })
            .then((alert) => {
              alert.present()
            })
        } else {
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
        }
      })
  }

  private processScan(barcodeData) {
    this.toastController
      .create({
        message: 'Scan réussi.',
        duration: 2000,
        color: 'success',
      })
      .then((toast) => {
        toast.present()
      })
    const appraisalId = Number.parseInt(barcodeData.text, 10)
    this.showAppraisal(appraisalId)
  }

  private showAppraisal(appraisalId: number) {
    this.dismissModal()
    this.loadingController.create().then((loader) => {
      loader.present()
      this.retrieveAppraisal(appraisalId).subscribe(
        (appraisal: AppraisalUI) => {
          loader.dismiss().then(() => {
            if (appraisal) {
              this.submitAppraisal(appraisal)
            }
          })
        }
      )
    })
  }

  protected retrieveAppraisal(appraisalId: number) {
    return this.appraisalUIService.waitForAppraisalId(appraisalId).pipe(
      map((appraisal: AppraisalUI) => {
        if (appraisal) {
          if (appraisal.appraiser === null) {
            return appraisal
          } else {
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
          }
        } else {
          this.toastController
            .create({
              message: `L\'observation n\'a pas pu être récupérée, pourriez-vous vérifier que vous êtes bien dans la liste des observateurs de cet étudiant?`,
              duration: 5000,
              color: 'danger',
            })
            .then((toast) => {
              toast.present()
            })
        }
        return null
      })
    )
  }

  submitAppraisal(appraisal: AppraisalUI) {
    appraisal.appraiser = this.authService.loggedUserValue

    this.appraisalUIService
      .submitAppraisal(appraisal)
      .subscribe((appraisalid) => {
        this.router.navigate(['appraisal-edit', appraisalid])
      })
  }
}
