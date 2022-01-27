/**
 * Base Data service file tests
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
import { GroupAssignmentModel } from '../../shared/models/moodle/group-assignment.model'
import { RoleModel } from '../../shared/models/moodle/role.model'
import { SituationModel } from '../../shared/models/moodle/situation.model'
import { CoreModule } from '../core.module'
import { SchoolsProviderService } from '../providers/schools-provider.service'
import { ServicesModule } from '../services.module'
import { AuthService } from './auth.service'
import { BaseDataService } from './base-data.service'
import { TestScheduler } from 'rxjs/testing'
import situations from 'src/mock/fixtures/situations'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('BaseDataService', () => {
  let mockedRouter: Router
  let testScheduler: TestScheduler
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

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected)
    })
  })
  afterAll(() => {
    worker.stop()
  })

  it('I retrieve all situation', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      // Now we expect the criteria to be the same as the one in the fixtures.
      expect(await service.situations$.toPromise()).toContain(
        new SituationModel({
          id: 1,
          title: 'Consultations de médecine générale',
          description:
            'Clinique des animaux de compagnie : médecine générale – médecine interne – médecine d’urgence et soins intensifs',
          descriptionformat: 1,
          idnumber: 'TMG',
          expectedevalsnb: 1,
          evalgridid: 1,
          timecreated: 1619376440,
          timemodified: 1619376440,
          usermodified: 0,
        })
      )
    }
  ))
  it('I retrieve my roles as student', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      // Now we expect the criteria to be the same as the one in the fixtures.
      expect(service.roles$.toPromise()).not.toContain(
        new RoleModel({
          id: 1,
          userid: 5,
          clsituationid: 1,
          type: 1,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        })
      )
    }
  ))
  it('I retrieve my roles as appraiser', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      await authService.login('appraiser1', 'password').toPromise() // We login first using the Mocked Auth service.
      expect(await service.roles$.toPromise()).toContain(
        new RoleModel({
          id: 1,
          userid: 5,
          clsituationid: 1,
          type: 1,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        })
      )
    }
  ))
  it('I retrieve my roles between different logins', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      // Now we expect the criteria to be the same as the one in the fixtures.
      const rolesStudent = await service.roles$.toPromise()
      expect(rolesStudent).not.toContain(
        new RoleModel({
          id: 1,
          userid: 5,
          clsituationid: 1,
          type: 1,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        })
      )
      authService.logout() // We log out
      await authService.login('appraiser1', 'password').toPromise() // We login first using the Mocked Auth service.
      const rolesAppraiser = await service.roles$.toPromise()
      expect(rolesAppraiser).toContain(
        new RoleModel({
          id: 1,
          userid: 5,
          clsituationid: 1,
          type: 1,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        })
      )
    }
  ))
  it('I retrieve my groupassignment', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      // We should have retrieved information for this user only.
      expect(await service.groupAssignments$.toPromise()).not.toContain(
        new GroupAssignmentModel({
          id: 6,
          studentid: 2,
          groupid: 1,
          usermodified: 0,
          timecreated: 1619376441,
          timemodified: 1619376441,
        })
      )
      expect(await service.groupAssignments$.toPromise()).toContain(
        new GroupAssignmentModel({
          id: 5,
          studentid: 1,
          groupid: 1,
          usermodified: 0,
          timecreated: 1619376441,
          timemodified: 1619376441,
        })
      )
    }
  ))
  it('Data should be loaded when login in', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      expect(await service.groupAssignments$.toPromise()).toContain(
        new GroupAssignmentModel({
          id: 5,
          studentid: 1,
          groupid: 1,
          usermodified: 0,
          timecreated: 1619376441,
          timemodified: 1619376441,
        })
      )
      expect(await service.situations$.toPromise()).toContain(
        new SituationModel({
          id: 1,
          title: 'Consultations de médecine générale',
          description:
            'Clinique des animaux de compagnie : médecine générale – médecine interne – médecine d’urgence et soins intensifs',
          descriptionformat: 1,
          idnumber: 'TMG',
          expectedevalsnb: 1,
          evalgridid: 1,
          timecreated: 1619376440,
          timemodified: 1619376440,
          usermodified: 0,
        })
      )
    }
  ))
  // // Test with marble diagrams.
  // it('refresh data rxjs scheduled correctly', inject(
  //   [SchoolsProviderService, AuthService, BaseDataService],
  //   async (
  //     schoolproviderService: SchoolsProviderService,
  //     authService: AuthService,
  //     service: BaseDataService
  //   ) => {
  //     schoolproviderService.setSelectedSchoolId('mock-api-instance')
  //     await authService.login('student1', 'password').toPromise()
  //     const values = {
  //       s: situations.map((s) => new SituationModel(s)),
  //     }
  //     testScheduler.run(async (helpers) => {
  //       const { cold, expectObservable, expectSubscriptions } = helpers
  //       expectObservable(service.situations$).toBe('(s)', values)
  //     })
  //   }
  // ))
})
