/**
 * Appraisal UI service file tests
 *
 * Manage ui service
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { HttpClientModule } from '@angular/common/http'
import { Component } from '@angular/core'
import { inject, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'

import { worker } from 'src/mock/browser'
import { CriterionModel } from '../../shared/models/moodle/criterion.model'
import { CoreModule } from '../core.module'
import { SchoolsProviderService } from '../providers/schools-provider.service'
import { ServicesModule } from '../services.module'
import { AuthService } from './auth.service'
import { BaseDataService } from './base-data.service'
import { TestScheduler } from 'rxjs/testing'
import situations from 'src/mock/fixtures/situations'
import { AppraisalUiService } from './appraisal-ui.service'
import { CriteriaService } from './criteria.service'
import { UserDataService } from './user-data.service'
import { EvalPlanService } from './eval-plan.service'
import { AppraisalService } from './appraisal.service'
import { AppraisalUI } from '../../shared/models/ui/appraisal-ui.model'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('AppraisalUIService', () => {
  let mockedRouter: Router
  // Start mock server.
  beforeAll(async () => {
    await worker.start()
  })
  beforeEach(() => {
    // Mock router.
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            component: TestComponent,
          },
        ]),
        ServicesModule,
        HttpClientModule,
        CoreModule,
      ],
    }).compileComponents()
    mockedRouter = TestBed.inject(Router)
  })
  afterEach(() => {
    worker.resetHandlers()
  })
  afterAll(() => {
    worker.stop()
  })

  it('I retrieve all appraisal models and transform them', inject(
    [
      SchoolsProviderService,
      AuthService,
      CriteriaService,
      UserDataService,
      EvalPlanService,
      AppraisalService,
      BaseDataService,
      AppraisalUiService,
    ],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      criteriaService: CriteriaService,
      userDataService: UserDataService,
      evalPlanService: EvalPlanService,
      appraisalService: AppraisalService,
      baseDataService: BaseDataService,
      service: AppraisalUiService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      await baseDataService.refreshAllEntities().toPromise()
      await service.refreshAppraisals().toPromise()
      // Now we expect the criteria to be the same as the one in the fixtures.
      const appraisals = service.appraisals$.getValue()
      expect(appraisals.length).toEqual(2)
      const expected = [
        {
          studentid: 1,
          appraiserid: 5,
          evalplanid: 13,
          groupid: 1,
          situationid: 1,
          criterianb: 7,
        },
        {
          studentid: 1,
          appraiserid: 6,
          evalplanid: 13,
          groupid: 1,
          situationid: 1,
          criterianb: 7,
        },
      ]
      expected.forEach((expectedvals, index) => {
        expect(appraisals[index].student.userid).toEqual(expectedvals.studentid)
        expect(appraisals[index].appraiser.userid).toEqual(
          expectedvals.appraiserid
        )
        expect(appraisals[index].evalPlan.id).toEqual(expectedvals.evalplanid)
        expect(appraisals[index].evalPlan.groupid).toEqual(expectedvals.groupid)
        expect(appraisals[index].evalPlan.clsituationid).toEqual(
          expectedvals.situationid
        )
        expect(appraisals[index].criteria.length).toEqual(
          expectedvals.criterianb
        )
      })
    }
  ))
})
