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
import { has } from 'lodash'

/**
 * Compares two objects and return false if different
 * @param a
 * @param b
 */
const compareObjects = (a, b) => {
  const s = (o) =>
    Object.entries(o)
      .sort()
      .map((i) => {
        if (i[1] instanceof Object) i[1] = s(i[1])
        return i
      })
  return JSON.stringify(s(a)) === JSON.stringify(s(b))
}

/**
 * Merge new array with existing and send a next signal
 *
 * @param currentValues
 * @param newValues
 * @param keyNames
 * @return any[] next set of values
 */

export const areSame = (
  currentValues: any[],
  newValues: any[],
  keyNames: string[]
) => {
  if (newValues == currentValues) {
    return true
  }
  if (newValues == null) {
    return !currentValues
  }
  if (
    (!newValues && currentValues) ||
    (newValues && !currentValues) ||
    newValues.length != currentValues.length
  ) {
    return false
  }
  const isSame = newValues.reduce((acc, newValue) => {
    const foundIndex = currentValues.findIndex((e) => {
      let isMatching = true
      keyNames.forEach((key) => {
        if (e[key] !== newValue[key]) {
          isMatching = false
        }
      })
      return isMatching
    })
    return acc && foundIndex
  }, true)
  return isSame
}

/**
 * Merge new array with existing and send a next signal
 *
 * @param currentValues
 * @param newValues
 * @param keyNames
 * @return any[] next set of values sorted by key
 */

export const mergeWithExisting = (
  currentValues: any[],
  newValues: any[],
  keyNames: string[]
) => {
  let nextValues = currentValues
  if (newValues) {
    nextValues = newValues.reduce(
      (acc, cval) => {
        const foundIndex = acc.findIndex((e) => {
          let isMatching = true
          keyNames.forEach((key) => {
            if (e[key] !== cval[key]) {
              isMatching = false
            }
          })
          return isMatching
        })
        // If the new value is not found or has changed, then we
        // add it to the list
        if (foundIndex === -1) {
          acc.push(cval)
        } else {
          if (!compareObjects(acc[foundIndex], cval)) {
            acc[foundIndex] = cval
          }
        }
        return acc
      },
      currentValues ? currentValues : []
    )

    nextValues.sort((e1, e2) => {
      let compareResults = 0
      keyNames.forEach((key) => {
        if (e1[key] instanceof String) {
          compareResults = compareResults || e1[key].localeCompare(e2[key])
        } else {
          compareResults = compareResults || e1[key] - e2[key]
        }
      })
      return compareResults
    })
  }
  return nextValues
}

export const getTokenFromLaunchURL = (launchURL, siteURL) => {
  if (launchURL) {
    const params = launchURL.split('://')

    if (params && params.length > 1) {
      const searchParams = new URLSearchParams(params[1])
      const tokenvalueb64 = searchParams.get('token')
      const tokenvalue = atob(tokenvalueb64)

      const tokenparts = tokenvalue.split(':::')
      // No trailing space.
      const hashedSiteURL = Md5.hashAsciiStr(
        siteURL.replace(/^(.+?)\/*?$/, '$1')
      ) as string
      if (tokenparts[0] !== hashedSiteURL) {
        throw new Error("Le site d'origine ne correspond pas" + tokenparts[0])
      }
      return tokenparts[1]
    }
  }
  return null
}
