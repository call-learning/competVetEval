import { CriterionGrid } from './criterion-grid.model'

export class EvalGrid {
  id: number
  criteria: CriterionGrid[]

  constructor(input: any) {
    Object.assign(this, input)
  }
}
