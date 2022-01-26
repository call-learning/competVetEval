/**
 * Helpers tests
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { Md5 } from 'ts-md5'
import { getTokenFromLaunchURL, mergeWithExisting } from './helpers'

const SIMPLE_VALUES = [
  { id: 1, subarray: [] },
  { id: 2, subarray: ['a', 'b', 'c'] },
  { id: 3, subarray: ['d', 'e', 'f'] },
]

const SIMPLE_VALUES_MERGE = [
  { id: 1, subarray: [1, 2, 3] },
  { id: 3, subarray: ['d', 'e', 'f'] },
  { id: 4, subarray: ['f', 'g', 'h'] },
]

const SIMPLE_VALUES_RESULT = [
  { id: 1, subarray: [1, 2, 3] },
  { id: 2, subarray: ['a', 'b', 'c'] },
  { id: 3, subarray: ['d', 'e', 'f'] },
  { id: 4, subarray: ['f', 'g', 'h'] },
]

const CURRENT_VALUES = [
  {
    id: 1,
    student: {
      userid: 1,
      password: 'password',
      username: 'student1',
      fullname: 'Fullname user1',
      firstname: 'Firstname user1',
      lastname: 'Lastname user1',
      userpictureurl: 'https://picsum.photos/100/100?random=1',
      token: 'stu123411',
      type: 'student',
    },
    appraiser: {
      userid: 5,
      password: 'password',
      username: 'appraiser1',
      fullname: 'Fullname appr1',
      firstname: 'Firstname appr1',
      lastname: 'Lastname appr1',
      userpictureurl: 'https://picsum.photos/100/100?random=5',
      token: 'appr123411',
      type: 'appraiser',
    },
    evalPlan: {
      id: 13,
      groupid: 1,
      clsituationid: 1,
      starttime: 1618253241,
      endtime: 1618858041,
      timecreated: 1619376441,
      timemodified: 1619376441,
      usermodified: 0,
    },
    context: 'A Context for this appraisal',
    comment: 'A Comment for this appraisal',
    criteria: [],
    timeModified: 1621264154,
  },
  {
    id: 2,
    student: {
      userid: 1,
      password: 'password',
      username: 'student1',
      fullname: 'Fullname user1',
      firstname: 'Firstname user1',
      lastname: 'Lastname user1',
      userpictureurl: 'https://picsum.photos/100/100?random=1',
      token: 'stu123411',
      type: 'student',
    },
    appraiser: {
      userid: 6,
      password: 'password',
      username: 'appraiser2',
      fullname: 'Fullname appr2',
      firstname: 'Firstname appr2',
      lastname: 'Lastname appr2',
      userpictureurl: 'https://picsum.photos/100/100?random=6',
      token: 'appr123422',
      type: 'appraiser',
    },
    evalPlan: {
      id: 13,
      groupid: 1,
      clsituationid: 1,
      starttime: 1618253241,
      endtime: 1618858041,
      timecreated: 1619376441,
      timemodified: 1619376441,
      usermodified: 0,
    },
    context: 'contexte principal appraisal 2',
    comment: 'commentaire appraisal 2',
    criteria: [],
    timeModified: 1621264192,
  },
]

const NEXT_VALUES_ADD_NEW = [
  {
    id: 2,
    student: {
      userid: 3,
      password: 'password',
      username: 'student1',
      fullname: 'Fullname user1',
      firstname: 'Firstname user1',
      lastname: 'Lastname user1',
      userpictureurl: 'https://picsum.photos/100/100?random=1',
      token: 'stu123411',
      type: 'student',
    },
    appraiser: {
      userid: 5,
      password: 'password',
      username: 'appraiser1',
      fullname: 'Fullname appr1',
      firstname: 'Firstname appr1',
      lastname: 'Lastname appr1',
      userpictureurl: 'https://picsum.photos/100/100?random=5',
      token: 'appr123411',
      type: 'appraiser',
    },
    evalPlan: {
      id: 13,
      groupid: 1,
      clsituationid: 1,
      starttime: 1618253241,
      endtime: 1618858041,
      timecreated: 1619376441,
      timemodified: 1619376441,
      usermodified: 0,
    },
    context: 'A Context for this appraisal',
    comment: 'A Comment for this appraisal',
    criteria: [],
    timeModified: 1621264154,
  },
]

const NEXT_VALUES_CHANGE = [
  {
    id: 1,
    student: {
      userid: 2, // Changed value
      password: 'password',
      username: 'student1',
      fullname: 'Fullname user1',
      firstname: 'Firstname user1',
      lastname: 'Lastname user1',
      userpictureurl: 'https://picsum.photos/100/100?random=1',
      token: 'stu123411',
      type: 'student',
    },
    appraiser: {
      userid: 5,
      password: 'password',
      username: 'appraiser1',
      fullname: 'Fullname appr1',
      firstname: 'Firstname appr1',
      lastname: 'Lastname appr1',
      userpictureurl: 'https://picsum.photos/100/100?random=5',
      token: 'appr123411',
      type: 'appraiser',
    },
    evalPlan: {
      id: 13,
      groupid: 1,
      clsituationid: 1,
      starttime: 1618253241,
      endtime: 1618858041,
      timecreated: 1619376441,
      timemodified: 1619376441,
      usermodified: 0,
    },
    context: 'A Context for this appraisal 1', // Changed value.
    comment: 'A Comment for this appraisal',
    criteria: [
      // Also changed value.
      {
        criterion: {
          id: 41,
          label: 'Savoir être',
          idnumber: 'Q001',
          parentid: 0,
          sort: 1,
          usermodified: 0,
          timecreated: 1619376440,
          timemodified: 1619376440,
        },
        comment: '',
        timeModified: 1621264154,
        subcriteria: [
          {
            criterion: {
              id: 42,
              label: 'Respect des horaires de travail',
              idnumber: 'Q002',
              parentid: 41,
              sort: 1,
              usermodified: 0,
              timecreated: 1619376440,
              timemodified: 1619376440,
            },
            comment: '',
            timeModified: 1621264154,
            subcriteria: [],
            id: 2,
            grade: 2,
          },
        ],
        id: 35,
      },
    ],
    timeModified: 1621264154,
  },
]

describe('Helpers', () => {
  it('I merge two array with objects', () => {
    expect(
      mergeWithExisting(SIMPLE_VALUES, SIMPLE_VALUES_MERGE, ['id'])
    ).toEqual(SIMPLE_VALUES_RESULT)
  })
  it('I merge an existing behavioursubject array with a new value', () => {
    expect(
      mergeWithExisting(SIMPLE_VALUES, NEXT_VALUES_ADD_NEW, ['id'])
    ).toContain(NEXT_VALUES_ADD_NEW[0])
  })

  it('I merge an existing behavioursubject array with a modified value', () => {
    expect(
      mergeWithExisting(SIMPLE_VALUES, NEXT_VALUES_CHANGE, ['id'])
    ).toContain(NEXT_VALUES_CHANGE[0])
  })

  it('I merge two arrays array with a modified value', () => {
    const mergedValues = mergeWithExisting(
      CURRENT_VALUES,
      [...NEXT_VALUES_CHANGE, ...NEXT_VALUES_ADD_NEW],
      ['id']
    )
    expect(mergedValues).toContain(NEXT_VALUES_CHANGE[0])
    expect(mergedValues).toContain(NEXT_VALUES_ADD_NEW[0])
  })

  it('I parse the token from WRONG url', () => {
    expect(getTokenFromLaunchURL('fakelaunchurl:/aa', '')).toBeNull()
  })

  it('When I parse a token, the origin site must match', () => {
    const siteUrl = 'http://localhost'
    const wrongsiteUrl =
      'fr.calllearning.competveteval://token=' +
      btoa(Md5.hashAsciiStr(siteUrl + '.com') + ':::abcdefg')
    expect(() => getTokenFromLaunchURL(wrongsiteUrl, siteUrl)).toThrowError()
  })

  it('When I parse a launchURL I must return the right token', () => {
    const siteUrl = 'http://localhost'
    const wrongsiteUrl =
      'fr.calllearning.competveteval://token=' +
      btoa(Md5.hashAsciiStr(siteUrl) + ':::abcdefg')
    expect(getTokenFromLaunchURL(wrongsiteUrl, siteUrl)).toBe('abcdefg')
  })
})
