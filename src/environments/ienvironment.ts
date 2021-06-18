import { School } from '../app/shared/models/school.model'

export interface IEnvironment {
  production: boolean
  mockServer: boolean
  helpUrl: string
  schoolConfigUrl?: string
  schools: Array<School>
  encryptSalt: string
}
