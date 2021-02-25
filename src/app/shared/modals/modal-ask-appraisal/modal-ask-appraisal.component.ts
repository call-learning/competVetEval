import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { IonTextarea, ModalController, ToastController } from '@ionic/angular'

@Component({
  selector: 'app-modal-ask-appraisal',
  templateUrl: './modal-ask-appraisal.component.html',
  styleUrls: ['./modal-ask-appraisal.component.scss'],
})
export class ModalAskAppraisalComponent implements OnInit, AfterViewInit {
  @Input() situation: any

  askAppraisalForm: FormGroup

  errorMsg = ''

  formSubmitted = false

  step: 'context' | 'qr-code' = 'context'

  @ViewChild('contextInput') contextInput: IonTextarea

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {
    this.askAppraisalForm = this.formBuilder.group({
      context: ['', [Validators.required]],
    })
  }

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.contextInput.setFocus()
    }, 500)
  }

  dismissModal() {
    this.modalController.dismiss({
      dismissed: true,
    })
  }

  nextStep() {
    this.errorMsg = ''
    this.formSubmitted = true

    if (this.askAppraisalForm.valid) {
      this.step = 'qr-code'
    } else {
      this.errorMsg = 'Le formulaire est invalide'
    }
  }

  previousStep() {
    this.step = 'context'
  }
}
