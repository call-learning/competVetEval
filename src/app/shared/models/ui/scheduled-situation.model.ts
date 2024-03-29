// This is an entity managed essentially by the app and display and transferred partially
// when needed to the server.
import { parseIntMember } from '../../utils/parse-functions'
import { EvalPlanModel } from '../moodle/eval-plan.model'
import { SituationModel } from '../moodle/situation.model'
import { AppraiserSituationStatsModel } from './appraiser-situation-stats.model'
import { StudentSituationStatsModel } from './student-situation-stats.model'

// This entity is deduced from several API calls to Moodle and compiled in the App

// We do not use lowerCamelCase for entities that are directly retrieved via API
// as Moodle does not use this convention in usual APIs
// We might use lowerCamelCase for attributes that are used internally in the APP though.
export class ScheduledSituation {
  evalPlanId: number // This will be the evalplan database id.
  situation: SituationModel
  evalPlan: EvalPlanModel
  studentId?: number
  stats: StudentSituationStatsModel | AppraiserSituationStatsModel

  constructor(input: any) {
    parseIntMember(input, 'evalPlanId')
    parseIntMember(input, 'studentId')

    Object.assign(this, input)

    if (this.situation) {
      this.situation = new SituationModel(this.situation)
    }

    if (this.evalPlan) {
      this.evalPlan = new EvalPlanModel(this.evalPlan)
    }
  }
}
