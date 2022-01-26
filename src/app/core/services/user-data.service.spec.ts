/**
 * User Data service tests
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
import { UserDataService } from './user-data.service'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('User Data Service', () => {
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

  it('I should be able to get all user profiles info', inject(
    [SchoolsProviderService, AuthService, UserDataService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      service: UserDataService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.

      const user1 = await service.getUserProfileInfo(1).toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      expect(user1.username).toEqual('student1')
      const user2 = await service.getUserProfileInfo(2).toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      expect(user2.username).toEqual('student2')
    }
  ))

  it('I should only retrieve a user info once', inject(
    [SchoolsProviderService, AuthService, UserDataService],
    async (
      schoolProviderService: SchoolsProviderService,
      authService: AuthService,
      service: UserDataService
    ) => {
      schoolProviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.

      const spiedService = spyOn(service, 'retrieveUserData').and.callThrough()
      const user1 = await service.getUserProfileInfo(1).toPromise()
      // Now we expect the plans to be the same as the one in the fixtures.
      expect(user1.username).toEqual('student1')
      // No call because this is current user.
      await service.getUserProfileInfo(1).toPromise()
      await service.getUserProfileInfo(1).toPromise()
      expect(spiedService.calls.count()).toEqual(0)
      // Only one call.
      await service.getUserProfileInfo(2).toPromise()
      await service.getUserProfileInfo(2).toPromise()
      expect(spiedService.calls.count()).toEqual(1)
    }
  ))
})
