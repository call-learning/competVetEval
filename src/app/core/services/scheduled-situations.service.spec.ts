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
import { ScheduledSituationService } from './scheduled-situation.service'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('Scheduled Situation Service', () => {
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
    })
    TestBed.compileComponents()
    mockedRouter = TestBed.inject(Router)
  })
  afterEach(() => {
    worker.resetHandlers()
    TestBed.resetTestingModule()
  })

  afterAll(() => {
    worker.stop()
  })

  it('As a student I should be able to see my situations', inject(
    [SchoolsProviderService, AuthService, ScheduledSituationService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      service: ScheduledSituationService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      const situations = await service.situations$.toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      // expect(situations).toContain(
      //   {}
      // )
      expect(situations.length).toEqual(6)
      authService.logout()
    }
  ))
  it('As an appraiser I should be able to see my situations', inject(
    [SchoolsProviderService, AuthService, ScheduledSituationService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      service: ScheduledSituationService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('appraiser1', 'password').toPromise() // We login first using the Mocked Auth service.
      const situations = await service.situations$.toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      // expect(situations).toContain(
      //   {}
      // )
      expect(situations.length).toEqual(16)
      authService.logout()
    }
  ))
  it('As appraiser2 I should be able to see my situations', inject(
    [SchoolsProviderService, AuthService, ScheduledSituationService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      service: ScheduledSituationService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('appraiser2', 'password').toPromise() // We login first using the Mocked Auth service.
      const situations = await service.situations$.toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      // expect(situations).toContain(
      //   {}
      // )
      expect(situations.length).toEqual(8)
      authService.logout()
    }
  ))
  it('As appraiser I should be able to see my situations and the stats', inject(
    [SchoolsProviderService, AuthService, ScheduledSituationService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      service: ScheduledSituationService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('appraiser2', 'password').toPromise() // We login first using the Mocked Auth service.
      const situations = await service.situations$.toPromise()
      await service.statsComputedEvent$.toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      // expect(situations).toContain(
      //   {}
      // )
      expect(situations.length).toEqual(8)
      situations.forEach((situation) => expect(!!situation.stats).toBeTrue())
      authService.logout()
    }
  ))
})
