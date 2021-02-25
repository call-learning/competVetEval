import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ModalController } from '@ionic/angular'

import { CriterionAppraisal } from '../../models/criterion-appraisal.model'

@Component({
  selector: 'app-modal-appraisal-criterion',
  templateUrl: './modal-appraisal-criterion.component.html',
  styleUrls: ['./modal-appraisal-criterion.component.scss'],
})
export class ModalAppraisalCriterionComponent implements OnInit {
  @Input() criterion: CriterionAppraisal

  commentForm: FormGroup

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    if (this.criterion.comment) {
      this.commentForm.patchValue({
        comment: this.criterion.comment,
      })
    }
  }

  dismissModal() {
    this.criterion.comment = this.commentForm.value.comment

    this.modalController.dismiss({
      dismissed: true,
    })
  }

  evaluateSubcriterion(subcriterion) {
    subcriterion.evaluating = true
  }

  dismissEvaluateSubcriterion(subcriterion) {
    subcriterion.evaluating = false
  }

  selectGrade(subcriterion, grade) {
    subcriterion.grade = grade
    this.dismissEvaluateSubcriterion(subcriterion)
  }
}
