export class CriterionAppraisal {
  id: number
  criterionId: number
  label?: string
  comment: string
  grade: number
  timeModified?: number
  subcriteria: CriterionAppraisal[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
