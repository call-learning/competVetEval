/**
 * School choice page
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { SchoolsProviderService } from 'src/app/core/providers/schools-provider.service'
import { School } from 'src/app/shared/models/school.model'
import { LocaleKeys } from 'src/app/shared/utils/locale-keys'
import { AuthService } from './../../core/services/auth.service'

@Component({
  selector: 'app-school-choice',
  templateUrl: './school-choice.page.html',
  styleUrls: ['./school-choice.page.scss'],
})
export class SchoolChoicePage implements OnInit {
  schoolsList: School[]

  constructor(
    private router: Router,
    private authService: AuthService,
    private schoolProviderService: SchoolsProviderService
  ) {}

  ngOnInit() {
    this.schoolProviderService.schoolList$.subscribe({
      complete: () => {
        this.schoolsList = this.schoolProviderService.schoolList$.getValue()
      },
    })
    LocaleKeys.cleanupAllLocalStorage()
  }

  chooseSchool(school: School) {
    this.authService.setChosenSchool(school)
    this.router.navigate(['/login'])
  }
}
