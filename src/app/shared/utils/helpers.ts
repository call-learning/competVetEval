/**
 * Generic helper/utils
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */

/**
 * Merge appraisal model when retrieving new ones
 * @param newAppraisals
 * @protected
 */
import { BehaviorSubject } from 'rxjs'
import { Md5 } from 'ts-md5'

/**
 * Merge new array with existing and send a next signal
 *
 * @param behaviourSubject
 * @param newEntities
 * @param keyname
 */
export const mergeExistingBehaviourSubject = (
  behaviourSubject: BehaviorSubject<any[]>,
  newEntities: any[],
  keynames: string[]
) => {
  if (newEntities) {
    const currentValues = behaviourSubject.getValue()
    let hasChanged = currentValues ? false : true

    let nextValues = newEntities.reduce(
      (acc, cval) => {
        const foundIndex = acc.findIndex((e) => {
          let isMatching = true
          keynames.forEach((key) => {
            if (e[key] !== cval[key]) {
              isMatching = false
            }
          })
          return isMatching
        })
        // If the new value is not found or has changed, then we
        // add it to the list
        if (foundIndex === -1) {
          hasChanged = true
          acc.push(cval)
        } else {
          if (!compareObjects(acc[foundIndex], cval)) {
            hasChanged = true
            acc[foundIndex] = cval
          }
        }
        return acc
      },
      currentValues ? currentValues : []
    )

    nextValues.sort((e1, e2) => {
      let compareResults = 0
      keynames.forEach((key) => {
        if (e1[key] instanceof String) {
          compareResults = compareResults || e1[key].localeCompare(e2[key])
        } else {
          compareResults = compareResults || e1[key] - e2[key]
        }
      })
    })
    if (hasChanged) {
      behaviourSubject.next(nextValues)
    }
  }
}

/**
 * Compares two objects and return false if different
 * @param a
 * @param b
 */
const compareObjects = (a, b) => {
  let s = (o) =>
    Object.entries(o)
      .sort()
      .map((i) => {
        if (i[1] instanceof Object) i[1] = s(i[1])
        return i
      })
  return JSON.stringify(s(a)) === JSON.stringify(s(b))
}

export const getTokenFromLaunchURL = (launchURL, siteURL) => {
  if (launchURL) {
    const params = launchURL.split('://')

    if (params && params.length > 1) {
      console.log('Token Params:' + params + ', Site URL:' + siteURL)
      const searchParams = new URLSearchParams(params[1])
      const tokenvalueb64 = searchParams.get('token')
      const tokenvalue = atob(tokenvalueb64)

      const tokenparts = tokenvalue.split(':::')
      // No trailing space.
      const hashedSiteURL = <string>(
        Md5.hashAsciiStr(siteURL.replace(/^(.+?)\/*?$/, '$1'))
      )
      if (tokenparts[0] != hashedSiteURL) {
        throw new Error("Le site d'origine ne correspond pas" + tokenparts[0])
      }
      console.log('User Token:' + tokenparts[1])
      return tokenparts[1]
    }
  }
  return null
}
