export class Criterion {
  id: number
  label: string
  sort: number
  gridId: number
  subcriteria: Criterion[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
