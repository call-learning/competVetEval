export class Situation {
  id: number
  title: string
  description: string
  startTime: number
  endTime: number
  type: string
  appraisalsRequired: number
  appraisalsCompleted?: number // This is a calculated field for display.
  appraisalAverage?: number
  comments: string
  status?: string // This is a calculated field for display.
  studentName?: string // This is a calculated field for display.
  studentId: number
  studentPictureUrl?: string
}
