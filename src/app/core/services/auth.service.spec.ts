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

import { AuthService, LOGIN_STATE } from './auth.service'
import { HttpAuthService } from '../http-services/http-auth.service'
import { Router } from '@angular/router'
import { Observable } from 'rxjs'
import { LoginResult } from '../../shared/models/auth.model'
import { CevUser } from '../../shared/models/cev-user.model'
import { inject, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { Component } from '@angular/core'
import SpyObj = jasmine.SpyObj
import { ServicesModule } from '../services.module'
import { MoodleApiService } from '../http-services/moodle-api.service'
import { EndpointsServices } from '../http-services/endpoints.services'
import { HttpClient } from '@angular/common/http'

// Dummy component for routes.
@Component({ template: '' })
class TestComponent {}

describe('AuthService', () => {
  let httpServiceFixture: SpyObj<HttpAuthService>
  let mockedRouter
  beforeEach(() => {
    httpServiceFixture = jasmine.createSpyObj('HttpAuthService', [
      'login',
      'getUserProfile',
      'getUserType',
    ])
    // Mock router AND HTTP request.
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpAuthService,
          useValue: httpServiceFixture,
        },
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            component: TestComponent,
          },
        ]),
        ServicesModule,
      ],
    }).compileComponents()
    mockedRouter = TestBed.inject(Router)
  })
  it('I login as a user and I should retrieve profile info', inject(
    [AuthService],
    (service: AuthService) => {
      httpServiceFixture.login.and.returnValue(
        new Observable((subscriber) =>
          subscriber.next(new LoginResult({ token: '1234565', errorcode: '' }))
        )
      )
      httpServiceFixture.getUserProfile.and.returnValue(
        new Observable((subscriber) =>
          subscriber.next(
            new CevUser({
              userid: 12345,
              fullname: 'fullname',
              firstname: 'firstname',
              lastname: 'lastname',
              username: 'username',
              userpictureurl: 'https://urlforpicture',
            })
          )
        )
      )
      httpServiceFixture.getUserType.and.returnValue(
        new Observable((subscriber) => subscriber.next('student'))
      )
      service.login('username', 'password').subscribe(() => {
        expect(service.loginState.getValue() == LOGIN_STATE.LOGGED).toBeTruthy()
        expect(service.loggedUser.getValue().username).toEqual('username')
        expect(service.loggedUser.getValue().userid).toEqual(12345)
      })
    }
  ))
  it('I use the wrong user details and I should not be logged in', inject(
    [AuthService],
    (service: AuthService) => {
      httpServiceFixture.login.and.returnValue(
        new Observable((subscriber) =>
          subscriber.next(new LoginResult({ token: null, errorcode: 'Error' }))
        )
      )

      service.login('username', 'password').subscribe(
        () => {},
        (error) => {
          expect(
            service.loginState.getValue() == LOGIN_STATE.LOGGED
          ).toBeFalse()
        }
      )
    }
  ))
  it('I login as a user and I logout, I should not have the status of "logged in"', inject(
    [AuthService],
    (service: AuthService) => {
      httpServiceFixture.login.and.returnValue(
        new Observable((subscriber) =>
          subscriber.next(new LoginResult({ token: '1234565', errorcode: '' }))
        )
      )
      httpServiceFixture.getUserProfile.and.returnValue(
        new Observable((subscriber) =>
          subscriber.next(
            new CevUser({
              userid: 12345,
              fullname: 'fullname',
              firstname: 'firstname',
              lastname: 'lastname',
              username: 'username',
              userpictureurl: 'https://urlforpicture',
            })
          )
        )
      )
      httpServiceFixture.getUserType.and.returnValue(
        new Observable((subscriber) => subscriber.next('student'))
      )
      service.login('username', 'password').subscribe(() => {
        expect(service.loginState.getValue() == LOGIN_STATE.LOGGED).toBeTruthy()
        expect(service.loggedUser.getValue().username).toEqual('username')
        expect(service.loggedUser.getValue().userid).toEqual(12345)
      })
      expect(service.isStillLoggedIn()).toBeTrue()
      service.logout()
      expect(service.isStillLoggedIn()).toBeFalse()
    }
  ))
})
