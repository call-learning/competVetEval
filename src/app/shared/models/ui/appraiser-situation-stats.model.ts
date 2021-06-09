// This is an entity managed essentially by the app and display and transferred partially
// when needed to the server.
// This entity is deduced from several API calls to Moodle and compiled in the App

import { parseIntMember } from '../../utils/parse-functions'

// We do not use lowerCamelCase for entities that are directly retrieved via API
// as Moodle does not use this convention in usual APIs
// We might use lowerCamelCase for attributes that are used internally in the APP though.

export class AppraiserSituationStatsModel {
  id: number // This will be the evalplan database id.
  appraisalsCompleted?: number // This is a calculated field for display.
  appraisalsRequired: number
  appraisalAverage?: number
  status?: string // This is a calculated field for display.
  studentId: number // Current student id
  constructor(input: any) {
    parseIntMember(input, 'id')
    parseIntMember(input, 'appraisalsCompleted')
    parseIntMember(input, 'appraisalsRequired')
    parseIntMember(input, 'appraisalAverage')
    parseIntMember(input, 'studentId')

    Object.assign(this, input)
  }
}
