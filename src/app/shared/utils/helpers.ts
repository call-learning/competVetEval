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
    let nextValues = newEntities
    if (currentValues) {
      // We need to merge.
      nextValues = currentValues.reduce((acc, cval) => {
        if (
          acc.findIndex((e) => {
            let isMatching = true
            keynames.forEach((key) => {
              if (e[key] !== cval[key]) {
                isMatching = false
              }
            })
            return isMatching
          }) === -1
        ) {
          acc.push(cval)
        }
        return acc
      }, newEntities)
    }

    behaviourSubject.next(nextValues)
  }
}

export const getTokenFromLaunchURL = (launchURL, siteURL) => {
  if (launchURL) {
    const params = launchURL.split('://')

    if (params) {
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
