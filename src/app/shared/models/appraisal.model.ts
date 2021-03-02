import { CriterionAppraisal } from './criterion-appraisal.model'

export class Appraisal {
  id?: number // Not set at creation.
  situationId: number
  situationTitle?: string
  context: string
  comment: string
  appraiserId: number
  type: number
  appraiserName?: string // When creating a new appraisal we don't need all the values set as they are mostly used
  // for display
  appraiserPictureUrl?: string
  studentId: number
  studentName?: string // When creating a new appraisal we don't need all the values set.
  studentPictureUrl?: string
  timeModified?: number // Can be absent at creation.
  criteria: CriterionAppraisal[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
