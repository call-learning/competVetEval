import { CriteriaAppraisal } from './criteria-appraisal.model'

export class Appraisal {
  id: number
  situationId: number
  context: string
  comment: string
  appraiserId: number
  type: number
  appraiserName: string
  studentId: number
  studentName: string
  timeModified: number
  criteria: CriteriaAppraisal[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
