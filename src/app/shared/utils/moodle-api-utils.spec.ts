/**
 * API Utils tests
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import { getTokenFromLaunchURL, mergeExistingBehaviourSubject } from './helpers'
import { BehaviorSubject } from 'rxjs'
import { AppraisalModel } from '../models/moodle/appraisal.model'
import { AppraisalCriterionModel } from '../models/moodle/appraisal-criterion.model'
import { AppraisalUI } from '../models/ui/appraisal-ui.model'
import { Md5 } from 'ts-md5'
import { MoodleApiUtils } from './moodle-api-utils'

describe('Moodle API Utils', () => {
  it('I can build a simple form Data', (done) => {
    const formData: FormData = new FormData()
    MoodleApiUtils.convertArguments(formData, 'testarg', 5)
    MoodleApiUtils.convertArguments(formData, 'testsecondarg', 'b')
    let realFormData = {}
    formData.forEach((value, key) => {
      realFormData[key] = value
    })
    expect(realFormData).toEqual({ testarg: '5', testsecondarg: 'b' })
    done()
  })
  it('I can build a form Data with Array', (done) => {
    const formData: FormData = new FormData()
    MoodleApiUtils.convertArguments(formData, 'testarg', ['a', 'b', 'c'])
    let realFormData = {}
    formData.forEach((value, key) => {
      realFormData[key] = value
    })
    expect(realFormData).toEqual({
      'testarg[0]': 'a',
      'testarg[1]': 'b',
      'testarg[2]': 'c',
    })
    done()
  })

  it('I can build a form Data with Object', (done) => {
    const formData: FormData = new FormData()
    MoodleApiUtils.convertArguments(formData, 'testarg', {
      attr1: 'a',
      attr2: 'b',
    })
    let realFormData = {}
    formData.forEach((value, key) => {
      realFormData[key] = value
    })
    expect(realFormData).toEqual({
      'testarg[attr1]': 'a',
      'testarg[attr2]': 'b',
    })
    done()
  })
  it('I can build a form Data with nested object and array', (done) => {
    const formData: FormData = new FormData()
    MoodleApiUtils.convertArguments(formData, 'testarg', {
      attr1: { a: 1, b: 1 },
      attr2: [1, 2, 3],
    })
    let realFormData = {}
    formData.forEach((value, key) => {
      realFormData[key] = value
    })
    expect(realFormData).toEqual({
      'testarg[attr1][a]': '1',
      'testarg[attr1][b]': '1',
      'testarg[attr2][0]': '1',
      'testarg[attr2][1]': '2',
      'testarg[attr2][2]': '3',
    })
    done()
  })
})
