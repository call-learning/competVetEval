// This is an entity managed essentially by the app and display and transferred partially
// when needed to the server.
import { EvalPlanModel } from '../moodle/eval-plan.model'
import { SituationModel } from '../moodle/situation.model'

// This entity is deduced from several API calls to Moodle and compiled in the App

// We do not use lowerCamelCase for entities that are directly retrieved via API
// as Moodle does not use this convention in usual APIs
// We might use lowerCamelCase for attributes that are used internally in the APP though.
export class ScheduledSituation {
  evalPlanId: number // This will be the evalplan database id.
  situation: SituationModel
  evalPlan: EvalPlanModel
  studentId?: number

  constructor(input: any) {
    Object.assign(this, input)
  }
}
