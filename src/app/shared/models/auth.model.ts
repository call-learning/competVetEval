export class LoginResult {
  token?: string

  errorcode?: string

  constructor(input) {
    Object.assign(this, input)
  }
}
