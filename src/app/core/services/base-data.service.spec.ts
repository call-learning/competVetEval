/**
 * Auth service file tests
 *
 * Manage authentication and user role
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
import { GroupAssignmentModel } from '../../shared/models/moodle/group-assignment.model'
import { RoleModel } from '../../shared/models/moodle/role.model'
import { SituationModel } from '../../shared/models/moodle/situation.model'
import { CoreModule } from '../core.module'
import { SchoolsProviderService } from '../providers/schools-provider.service'
import { ServicesModule } from '../services.module'
import { AuthService } from './auth.service'
import { BaseDataService } from './base-data.service'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('BaseDataService', () => {
  let mockedRouter: Router
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
  it('I retrieve all criterion', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      await service.refresh('criterion').toPromise()
      // Now we expect the criteria to be the same as the one in the fixtures.
      expect(service.entities$.criterion.getValue()).toContain(
        new CriterionModel({
          id: '41',
          label: 'Savoir être',
          idnumber: 'Q001',
          parentid: '0',
          sort: '1',
          usermodified: '0',
          timecreated: '1619376440',
          timemodified: '1619376440',
        })
      )
    }
  ))
  it('I retrieve all situation', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      await service.refresh('clsituation').toPromise()
      // Now we expect the criteria to be the same as the one in the fixtures.
      expect(service.entities$.clsituation.getValue()).toContain(
        new SituationModel({
          id: '1',
          title: 'Consultations de médecine générale',
          description:
            'Clinique des animaux de compagnie : médecine générale – médecine interne – médecine d’urgence et soins intensifs',
          descriptionformat: '1',
          idnumber: 'TMG',
          expectedevalsnb: '1',
          evalgridid: '1',
          timecreated: '1619376440',
          timemodified: '1619376440',
          usermodified: '0',
        })
      )
    }
  ))
  it('I retrieve my roles', inject(
    [SchoolsProviderService, AuthService, BaseDataService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      service: BaseDataService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      await service.refresh('role').toPromise()
      // Now we expect the criteria to be the same as the one in the fixtures.
      expect(service.entities$.role.getValue()).not.toContain(
        new RoleModel({
          id: '1',
          userid: '5',
          clsituationid: '1',
          type: '1',
          usermodified: '0',
          timecreated: '1619376440',
          timemodified: '1619376440',
        })
      )
      authService.logout() // We login first using the Mocked Auth service.
      await authService.login('appraiser1', 'password').toPromise() // We login first using the Mocked Auth service.
      await service.refresh('role').toPromise()
      expect(service.entities$.role.getValue()).toContain(
        new RoleModel({
          id: '1',
          userid: '5',
          clsituationid: '1',
          type: '1',
          usermodified: '0',
          timecreated: '1619376440',
          timemodified: '1619376440',
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
      await service.refresh('role').toPromise()
      // Now we expect the criteria to be the same as the one in the fixtures.
      // We should have retrieved information for this user only.
      expect(service.entities$.group_assign.getValue()).not.toContain(
        new GroupAssignmentModel({
          id: '6',
          studentid: '2',
          groupid: '1',
          usermodified: '0',
          timecreated: '1619376441',
          timemodified: '1619376441',
        })
      )
      expect(service.entities$.group_assign.getValue()).toContain(
        new GroupAssignmentModel({
          id: '5',
          studentid: '1',
          groupid: '1',
          usermodified: '0',
          timecreated: '1619376441',
          timemodified: '1619376441',
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
      // await service.groupAssignment.toPromise()
      await service.situations$.toPromise()
      await service.groupAssignment$.toPromise()
      expect(service.entities$.group_assign.getValue()).toContain(
        new GroupAssignmentModel({
          id: '5',
          studentid: '1',
          groupid: '1',
          usermodified: '0',
          timecreated: '1619376441',
          timemodified: '1619376441',
        })
      )
      expect(service.entities$.clsituation.getValue()).toContain(
        new SituationModel({
          id: '1',
          title: 'Consultations de médecine générale',
          description:
            'Clinique des animaux de compagnie : médecine générale – médecine interne – médecine d’urgence et soins intensifs',
          descriptionformat: '1',
          idnumber: 'TMG',
          expectedevalsnb: '1',
          evalgridid: '1',
          timecreated: '1619376440',
          timemodified: '1619376440',
          usermodified: '0',
        })
      )
    }
  ))
})

// Note : We could have also used the HTTT Testing controller
// Here we describe the expected sequence of events though HttpTestingController.
// let req = httpTestingController.expectOne(
//   `${schoolproviderService.getSelectedSchoolUrl()}/webservice/rest/server.php?moodlewsrestformat=json`
// )
// expect(Array.from(req.request.body.entries())).toEqual([
//   ['moodlewssettingfilter', 'true'],
//   ['moodlewssettingfileurl', 'true'],
//   ['wsfunction', 'local_cveteval_get_latest_modifications'],
//   ['entitytype', 'criterion'],
// ])
// req.flush(13456)
// req = httpTestingController.expectOne(
//   `${schoolproviderService.getSelectedSchoolUrl()}/webservice/rest/server.php?moodlewsrestformat=json`
// )
// expect(Array.from(req.request.body.entries())).toEqual([
//   ['moodlewssettingfilter', 'true'],
//   ['moodlewssettingfileurl', 'true'],
//   ['wsfunction', 'local_cveteval_get_all_criterion'],
// ])
// const criteria = [
//   new CriterionModel({
//     id: 1,
//     label: 'criteriaLabel',
//     idnumber: '13345',
//     parentid: 0,
//     sort: 0,
//   }),
// ]
// req.flush(criteria)
// httpTestingController.verify()
