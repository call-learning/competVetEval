/**
 * Ask appraisal components
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'

import { IonTextarea, ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-show-appraisal-barcode',
  templateUrl: './modal-show-appraisal-barcode.component.html',
  styleUrls: ['./modal-show-appraisal-barcode.scss'],
})
export class ModalShowAppraisalBarcodeComponent
  implements OnInit, AfterViewInit
{
  @Input() appraisalId: number

  qrCodeData: string = null

  @ViewChild('contextInput') contextInput: IonTextarea

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.qrCodeData = `${this.appraisalId}`
    }, 500)
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }
}
