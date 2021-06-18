/**
 * Appraisal criterion popup component
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ModalController } from '@ionic/angular'

import { CriterionForAppraisalTreeModel } from '../../models/ui/criterion-for-appraisal-tree.model'

@Component({
  selector: 'app-modal-appraisal-criterion',
  templateUrl: './modal-appraisal-criterion.component.html',
  styleUrls: ['./modal-appraisal-criterion.component.scss'],
})
export class ModalAppraisalCriterionComponent implements OnInit {
  @Input() criterion: CriterionForAppraisalTreeModel

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
    if (grade === null) {
      delete subcriterion.grade
    } else {
      subcriterion.grade = grade
    }
    this.dismissEvaluateSubcriterion(subcriterion)
  }
}
