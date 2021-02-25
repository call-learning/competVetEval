export class CevUser {
  firstname: string
  fullname: string
  lastname: string
  username: string
  userid: number
  userpictureurl: string

  constructor(input: any) {
    Object.assign(this, input)
  }
}
