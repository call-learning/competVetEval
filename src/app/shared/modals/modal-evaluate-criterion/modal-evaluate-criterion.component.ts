import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-modal-evaluate-criterion',
  templateUrl: './modal-evaluate-criterion.component.html',
  styleUrls: ['./modal-evaluate-criterion.component.scss'],
})
export class ModalEvaluateCriterionComponent implements OnInit {
  @Input() criterion: any

  commentForm: FormGroup

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    })
  }

  ngOnInit() {}

  dismissModal() {
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
