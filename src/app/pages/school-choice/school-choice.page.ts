import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { SchoolsProviderService } from 'src/app/core/providers/schools-provider.service'
import { School } from 'src/app/shared/models/school.model'
import { LocaleKeys } from 'src/app/shared/utils/locale-keys'

@Component({
  selector: 'app-school-choice',
  templateUrl: './school-choice.page.html',
  styleUrls: ['./school-choice.page.scss'],
})
export class SchoolChoicePage implements OnInit {
  schoolsList: School[]

  constructor(
    private schoolsProviderService: SchoolsProviderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.schoolsList = this.schoolsProviderService.getSchoolsList()
  }

  chooseSchool(school: School) {
    localStorage.setItem(LocaleKeys.schoolChoiceId, school.id)
    this.router.navigate(['/login'])
  }
}
