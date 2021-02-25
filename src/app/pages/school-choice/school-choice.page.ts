import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ToastController } from '@ionic/angular'

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
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.schoolsList = SchoolsProviderService.getSchoolsList()
  }

  chooseSchool(school: School) {
    this.authService.setChosenSchool(school)
    this.router.navigate(['/login'])
  }
}
