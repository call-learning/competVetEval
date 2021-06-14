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
