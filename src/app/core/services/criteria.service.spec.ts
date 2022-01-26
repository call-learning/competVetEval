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
import { CriterionModel } from '../../shared/models/moodle/criterion.model'
import { CoreModule } from '../core.module'
import { SchoolsProviderService } from '../providers/schools-provider.service'
import { ServicesModule } from '../services.module'
import { AuthService } from './auth.service'
import { BaseDataService } from './base-data.service'
import { CriteriaService } from './criteria.service'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('Criteria Service', () => {
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

  it('I retrieve all criterion as a tree', inject(
    [SchoolsProviderService, AuthService, BaseDataService, CriteriaService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      baseDataService: BaseDataService,
      service: CriteriaService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      const situations = await baseDataService.situations$.toPromise()
      const criteriaTree = await service
        .getCriteriaTree(situations[0].evalgridid)
        .toPromise()
      // Now we expect the criteria to be the same as the one in the fixtures.
      expect(criteriaTree[0].criterion).toEqual(
        new CriterionModel({
          id: 41,
          label: 'Savoir être',
          idnumber: 'Q001',
          parentid: 0,
          evalgridid: 1,
          sort: 1,
          usermodified: 0,
          timecreated: '1619376440',
          timemodified: '1619376440',
        })
      )
    }
  ))
  it('I retrieve all criterion as a list', inject(
    [SchoolsProviderService, AuthService, BaseDataService, CriteriaService],
    async (
      schoolproviderService: SchoolsProviderService,
      authService: AuthService,
      baseDataService: BaseDataService,
      service: CriteriaService
    ) => {
      schoolproviderService.setSelectedSchoolId('mock-api-instance')
      await authService.login('student1', 'password').toPromise() // We login first using the Mocked Auth service.
      const situations = await baseDataService.situations$.toPromise()
      const criteriaList = await service
        .getCriteria(situations[0].evalgridid)
        .toPromise()
      // Now we expect the criteria to be the same as the one in the fixtures.
      expect(criteriaList[0]).toEqual(
        new CriterionModel({
          id: 41,
          label: 'Savoir être',
          idnumber: 'Q001',
          parentid: 0,
          evalgridid: 1,
          sort: 1,
          usermodified: 0,
          timecreated: '1619376440',
          timemodified: '1619376440',
        })
      )
    }
  ))
})
