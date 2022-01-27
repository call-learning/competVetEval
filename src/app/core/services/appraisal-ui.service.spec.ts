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
  // https://stackoverflow.com/questions/29352578/some-of-your-tests-did-a-full-page-reload-error-when-running-jasmine-tests
  window.onbeforeunload = jasmine.createSpy() // Prevent error message "Some of your tests did a full page reload"
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
    TestBed.resetTestingModule()
  })
  afterAll(() => {
    worker.stop()
  })

  it('I retrieve all appraisal models and transform them', inject(
    [SchoolsProviderService, AuthService, AppraisalUiService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: AppraisalUiService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      // Now we expect the criteria to be the same as the one in the fixtures.
      const appraisals = await service.appraisals$.toPromise()
      expect(appraisals.length).toEqual(2)
      const expected = {
        1: {
          studentid: 1,
          appraiserid: 5,
          evalplanid: 13,
          groupid: 1,
          situationid: 1,
          criterianb: 7,
        },
        2: {
          studentid: 1,
          appraiserid: 6,
          evalplanid: 13,
          groupid: 1,
          situationid: 1,
          criterianb: 7,
        },
      }
      appraisals.forEach((appraisal) => {
        const id = appraisal.id
        const expectedvals = expected[id]
        expect(appraisal.student.userid).toEqual(expectedvals.studentid)
        expect(appraisal.appraiser.userid).toEqual(expectedvals.appraiserid)
        expect(appraisal.evalPlan.id).toEqual(expectedvals.evalplanid)
        expect(appraisal.evalPlan.groupid).toEqual(expectedvals.groupid)
        expect(appraisal.evalPlan.clsituationid).toEqual(
          expectedvals.situationid
        )
        expect(appraisal.criteria.length).toEqual(expectedvals.criterianb)
      })
    }
  ))
})
