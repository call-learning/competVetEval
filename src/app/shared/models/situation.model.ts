export class Situation {
  id: number
  title: string
  startTime: number
  endTime: number
  type: string
  evaluationsRequired: number
  evaluationsCompleted: number
  comments: string
  status: string

  constructor(input: any) {
    Object.assign(this, input)
  }
}
