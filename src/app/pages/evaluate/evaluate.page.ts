import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { ModalController, ToastController } from '@ionic/angular'

import { filter, takeUntil } from 'rxjs/operators'
import { AppraisalService } from '../../core/services/appraisal.service'
import { AuthService } from '../../core/services/auth.service'
import { CriteriaService } from '../../core/services/criteria.service'
import { SituationService } from '../../core/services/situation.service'
import { BaseComponent } from '../../shared/components/base/base.component'
import { ModalEvaluateCriterionComponent } from '../../shared/modals/modal-appraisal-criterion/modal-evaluate-criterion.component'
import { Appraisal } from '../../shared/models/appraisal.model'
import { CriterionAppraisal } from '../../shared/models/criterion-appraisal.model'
import { Criterion } from '../../shared/models/criterion.model'

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.page.html',
  styleUrls: ['./evaluate.page.scss'],
})
export class EvaluatePage extends BaseComponent implements OnInit {
  appraisal
  situationId
  studentId

  contextForm: FormGroup
  commentForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
    private criteriaService: CriteriaService,
    private situationService: SituationService,
    private appraisalService: AppraisalService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    super()
    this.contextForm = this.formBuilder.group({
      context: ['', [Validators.required]],
    })

    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    // Create a new evaluation/appraisal.
    // TODO : add a workflow so to enable edition of an existing evaluation.
    // TODO: check if user is an appraiser or evaluator (i.e. can create a new appraisal)
    this.situationId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('situationId'),
      10
    )
    this.studentId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('studentId'),
      10
    )
    this.appraisal = null
    this.authService.currentUserRole
      .pipe(
        takeUntil(this.alive$),
        filter((mode) => !!mode)
      )
      .subscribe((mode) => {
        this.criteriaService
          .retrieveCriteria()
          .subscribe((criteria: Criterion[]) => {
            const situation = this.situationService.situations.find(
              (sit) => sit.id === this.situationId
            )
            const transformCriteriaIntoAppraisalCriteria = (crit: Criterion) =>
              new CriterionAppraisal({
                criterionId: crit.id,
                label: crit.label,
                comment: '',
                grade: 0,
                subcriteria: crit.subcriteria.map(
                  transformCriteriaIntoAppraisalCriteria
                ),
              })
            const criterionAppraisal = criteria.map(
              transformCriteriaIntoAppraisalCriteria
            )
            this.appraisal = new Appraisal({
              situationId: this.situationId,
              situationTitle: situation.title,
              context: '',
              comment: '',
              appraiserId: this.authService.loggedUser.getValue().userid,
              type: 1,
              studentId: this.studentId,
              timeModified: Date.now(),
              criteria: criterionAppraisal,
            })
          })
      })
  }

  evaluateCriterion(criterion, event: Event) {
    event.stopPropagation()
    criterion.evaluating = true
  }

  dismissEvaluateCriterion(criterion, event: Event) {
    if (event) {
      event.stopPropagation()
    }

    criterion.evaluating = false
  }

  selectGrade(criterion, grade, event) {
    event.stopPropagation()
    criterion.grade = grade
    this.dismissEvaluateCriterion(criterion, null)
  }

  openModalEvaluateCriterion(criterion) {
    this.modalController
      .create({
        component: ModalEvaluateCriterionComponent,
        componentProps: {
          criterion,
        },
      })
      .then((modal) => {
        modal.present()
      })
  }

  saveAndRedirect() {
    this.appraisalService
      .submitAppraisal(
        this.appraisal,
        this.authService.loggedUser.getValue().userid,
        this.studentId
      )
      .subscribe(() => {
        this.toastController
          .create({
            message: 'Enregistré !',
            duration: 2000,
            color: 'success',
          })
          .then((toast) => {
            toast.present()
          })
        this.router.navigate(['situations-list'])
      })
  }

  notImplemented() {
    this.toastController
      .create({
        message: 'Not implemented',
        duration: 2000,
        color: 'danger',
      })
      .then((toast) => {
        toast.present()
      })
  }
}
