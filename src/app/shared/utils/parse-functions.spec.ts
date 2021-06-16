/**
 * Parse functions tests
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

import {
  parseBooleanMember,
  parseDateFromTimestampMember,
  parseDateMember,
  parseFloatMember,
  parseIntMember,
} from './parse-functions'

describe('Parse functions', () => {
  it('Parse int', (done) => {
    const obj = {
      a: '10',
      b: '10a',
      c: 'a',
    }
    parseIntMember(obj, 'a')
    parseIntMember(obj, 'b')
    parseIntMember(obj, 'c')
    // @ts-ignore
    expect(obj.a === 10).toBeTrue()
    // @ts-ignore
    expect(obj.b === 10).toBeTrue()
    // @ts-ignore
    expect(obj.c).toBeNaN()
    done()
  })

  it('Parse float', (done) => {
    const obj = {
      a: '10.1',
      b: '10.1a',
      c: 'a',
    }
    parseFloatMember(obj, 'a')
    parseFloatMember(obj, 'b')
    parseFloatMember(obj, 'c')
    // @ts-ignore
    expect(obj.a === 10.1).toBeTrue()
    // @ts-ignore
    expect(obj.b === 10.1).toBeTrue()
    // @ts-ignore
    expect(obj.c).toBeNaN()
    done()
  })

  it('Parse boolean', (done) => {
    const obj = {
      a: true,
      b: '1',
      c: 'test',
    }
    parseBooleanMember(obj, 'a')
    parseBooleanMember(obj, 'b')
    parseBooleanMember(obj, 'c')
    // @ts-ignore
    expect(obj.a).toBeTrue()
    // @ts-ignore
    expect(obj.b).toBeTrue()
    // @ts-ignore
    expect(obj.c).toBeFalse()
    done()
  })

  it('Parse date', (done) => {
    const obj = {
      a: '2021-06-27',
      b: 'wrongdate',
    }
    parseDateMember(obj, 'a')
    parseDateMember(obj, 'b')
    // @ts-ignore
    expect(obj.a.toUTCString()).toEqual('Sun, 27 Jun 2021 00:00:00 GMT')
    // @ts-ignore
    expect(obj.b.toString()).toBe('Invalid Date')
    done()
  })

  it('Parse timestamp', (done) => {
    const obj = {
      a: '1623826344',
      b: 'wrongdate',
    }
    parseDateFromTimestampMember(obj, 'a')
    parseDateFromTimestampMember(obj, 'b')
    // @ts-ignore
    expect(obj.a.toUTCString()).toEqual('Wed, 16 Jun 2021 06:52:24 GMT')
    // @ts-ignore
    expect(obj.b.toString()).toBe('Invalid Date')
    done()
  })
})
