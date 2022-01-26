/**
 * Criteria service tests
 *
 * Manage base data (situation,...)
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
import { CoreModule } from '../core.module'
import { SchoolsProviderService } from '../providers/schools-provider.service'
import { ServicesModule } from '../services.module'
import { AuthService } from './auth.service'
import { BaseDataService } from './base-data.service'
import { EvalPlanService } from './eval-plan.service'
import { EvalPlanModel } from '../../shared/models/moodle/eval-plan.model'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('Eval plan Service', () => {
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

  it('I should receive all eval plan', inject(
    [SchoolsProviderService, AuthService, BaseDataService, EvalPlanService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      baseDataService: BaseDataService,
      service: EvalPlanService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      const plans = await service.plans$.toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      expect(plans).toContain(
        new EvalPlanModel({
          id: 13,
          groupid: 1,
          clsituationid: 1,
          starttime: 1618253241,
          endtime: 1618858041,
          timecreated: 1619376441,
          timemodified: 1619376441,
          usermodified: 0,
        })
      )
      expect(plans.length).toEqual(13)
    }
  ))
  it('I should get Eval grid ID from an eval plan', inject(
    [SchoolsProviderService, AuthService, BaseDataService, EvalPlanService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      baseDataService: BaseDataService,
      service: EvalPlanService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      const evalGridId = await service
        .getEvalGridIdFromEvalPlanId(13)
        .toPromise()
      const evalGridIdNotFound = await service
        .getEvalGridIdFromEvalPlanId(250)
        .toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      expect(evalGridId).toEqual(1)
      expect(evalGridIdNotFound).toEqual(1)
    }
  ))
  it('I should get Eval grid ID from an eval plan', inject(
    [SchoolsProviderService, AuthService, BaseDataService, EvalPlanService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      baseDataService: BaseDataService,
      service: EvalPlanService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      const evalGridId = await service
        .getEvalGridIdFromEvalPlanId(25)
        .toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      expect(evalGridId).toEqual(2)
    }
  ))
})
