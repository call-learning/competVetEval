/**
 * School provider URL management tests
 *
 * Manage entities for connexion
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { async, inject, TestBed } from '@angular/core/testing'

import { SchoolsProviderService } from './schools-provider.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'

describe('SchoolsProviderService', () => {
  let httpTestingController: HttpTestingController
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }).compileComponents()
  }))
  beforeEach(() => (httpTestingController = TestBed.get(HttpTestingController)))
  afterEach(() => {
    httpTestingController.verify()
  })

  it('There should be no school selected at first', inject(
    [SchoolsProviderService],
    (service: SchoolsProviderService) => {
      localStorage.clear()
      const schoolId = service.getSelectedSchoolId()
      expect(schoolId).toBeNull()
    }
  ))
  it('We should keep the selected school in storage', inject(
    [SchoolsProviderService],
    (service: SchoolsProviderService) => {
      localStorage.clear()
      expect(service.getSelectedSchoolId()).toBeNull()
      service.setSelectedSchoolId('id1')
      expect(service.getSelectedSchoolId()).toEqual('id1')
    }
  ))
})
