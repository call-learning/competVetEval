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
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { IonTextarea, ModalController } from '@ionic/angular'

import { ScheduledSituation } from './../../models/ui/scheduled-situation.model'
import { AppraisalUiService } from '../../../core/services/appraisal-ui.service'
import { AuthService } from '../../../core/services/auth.service'

@Component({
  selector: 'app-show-appraisal-barcode',
  templateUrl: './show-appraisal-barcode.component.html',
  styleUrls: ['./show-appraisal-barcode.scss'],
})
export class ShowAppraisalBarcodeComponent implements OnInit, AfterViewInit {
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
