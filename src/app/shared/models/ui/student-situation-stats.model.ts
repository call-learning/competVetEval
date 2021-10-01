// This is an entity managed essentially by the app and display and transferred partially
// when needed to the server.
// This entity is deduced from several API calls to Moodle and compiled in the App

import { parseIntMember } from '../../utils/parse-functions'

// We do not use lowerCamelCase for entities that are directly retrieved via API
// as Moodle does not use this convention in usual APIs
// We might use lowerCamelCase for attributes that are used internally in the APP though.
// nnkitodo[FILE]
export class StudentSituationStatsModel {
  id: number // This will be the evalplan database id.
  appraisalsCompleted?: number // This is a calculated field for display.
  appraisalsRequired: number
  appraisalAverage?: number
  status?: string // This is a calculated field for display.

  constructor(input: any) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'appraisalsCompleted')
    parseIntMember(input, 'appraisalsRequired')
    parseIntMember(input, 'appraisalAverage')

    Object.assign(this, input)
  }
}
