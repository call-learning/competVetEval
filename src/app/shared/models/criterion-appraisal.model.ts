export class CriterionAppraisal {
  id?: number // Not set at creation.
  criterionId: number
  label?: string // This is a field for display only.
  comment: string
  grade: number
  timeModified?: number
  subcriteria: CriterionAppraisal[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
