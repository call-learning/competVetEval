/**
 * Appraisal ervice file tests
 *
 * Manage appraisals service
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
import { AppraisalModel } from '../../shared/models/moodle/appraisal.model'
import { AppraisalCriterionModel } from '../../shared/models/moodle/appraisal-criterion.model'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('AppraisalService', () => {
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

  it('I retrieve all appraisal models', inject(
    [SchoolsProviderService, AuthService, AppraisalService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: AppraisalService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      // Now we expect the criteria to be the same as the one in the fixtures.
      const appraisals = await service.appraisals$.toPromise()
      expect(appraisals.length).toEqual(2)
    }
  ))
  it('I retrieve all appraisal criterion models', inject(
    [SchoolsProviderService, AuthService, AppraisalService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: AppraisalService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      // Now we expect the criteria to be the same as the one in the fixtures.
      const appraisalsCriteria = await service.appraisalCriteria$.toPromise()
      expect(appraisalsCriteria.length).toEqual(80) // 40 criterion
    }
  ))
  it('I get a message when all criteria are loaded', (done) =>
    inject(
      [SchoolsProviderService, AuthService, AppraisalService],
      async (
        schoolproviderService: SchoolsProviderService,
        authService: AuthService,
        service: AppraisalService
      ) => {
        schoolproviderService.setSelectedSchoolId('mock-api-instance')

        await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
        // Now we expect the criteria to be the same as the one in the fixtures.
        service.forceRefresh()

        service.appraisalLoadedEvent.subscribe(
          ({
            appraisals: appraisalModel,
            appraisalCriterionModels: appraisalsCriteria,
          }) => {
            expect(appraisalsCriteria.length).toEqual(80) // 80 criterion
            expect(appraisalModel.length).toEqual(2)
            done()
          }
        )
      }
    )()) // Braket important here if not never called: https://stackoverflow.com/questions/25274152/jasmine-2-0-async-done-and-angular-mocks-inject-in-same-test-it

  // TODO: submit appraisal and so on.
})
