import { CriterionAppraisal } from './criterion-appraisal.model'

export class Appraisal {
  id: number
  situationId: number
  situationTitle: string
  context: string
  comment: string
  appraiserId: number
  type: number
  appraiserName: string
  studentId: number
  studentName: string
  timeModified: number
  criteria: CriterionAppraisal[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
