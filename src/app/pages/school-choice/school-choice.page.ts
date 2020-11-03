import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { SchoolsProviderService } from 'src/app/core/providers/schools-provider.service'
import { School } from 'src/app/shared/models/school.model'
import { AuthService } from './../../core/services/auth.service'

@Component({
  selector: 'app-school-choice',
  templateUrl: './school-choice.page.html',
  styleUrls: ['./school-choice.page.scss'],
})
export class SchoolChoicePage implements OnInit {
  schoolsList: School[]

  constructor(
    private schoolsProviderService: SchoolsProviderService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.schoolsList = this.schoolsProviderService.getSchoolsList()
  }

  chooseSchool(school: School) {
    this.authService.setChosenSchool(school)
    this.router.navigate(['/login'])
  }
}
