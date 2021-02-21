export class CriterionGrid {
  id: number
  label: string
  sort: number
  subcriteria: CriterionGrid[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
