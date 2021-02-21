export class CriteriaAppraisal {
  id: number
  criterionId: number
  comment: string
  grade: number
  timeModified: number
  subcriteria: CriteriaAppraisal[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
