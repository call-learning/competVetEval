export class Situation {
  id: number
  title: string
  startTime: number
  endTime: number
  type: string
  appraisalsRequired: number
  appraisalsCompleted?: number
  comments: string
  status?: string
  studentName?: string
  studentId?: number

  constructor(input: any) {
    Object.assign(this, input)
  }
}
