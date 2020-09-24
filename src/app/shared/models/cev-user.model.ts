export class CevUser {
  firstname: string
  fullname: string
  lastname: string
  username: string
  userpictureurl: string

  constructor(input: any) {
    Object.assign(this, input)
  }
}
