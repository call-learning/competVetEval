import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: false,
  mockServer: false,
  schools: [
    {
      id: 'dev-instance',
      name: 'Local Development Instance',
      logo: 'assets/images/schools/logo-calllearning.png',
      moodleUrl: 'http://cveteval.call-learning.fr',
    },
  ],
}
