import { School } from '../app/shared/models/school.model'

export interface IEnvironment {
  production: boolean
  mockServer: boolean
  schools: Array<School>
}
