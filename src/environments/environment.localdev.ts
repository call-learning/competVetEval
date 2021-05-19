import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: false,
  mockServer: false,
  schools: [
    {
      id: 'local-server',
      name: 'Local server',
      logo: 'assets/images/schools/logo-calllearning-local.png',
      moodleUrl: 'http://competveteval.local/',
    },
    {
      id: 'remote-server',
      name: 'Remote server',
      logo: 'assets/images/schools/logo-calllearning.png',
      moodleUrl: 'https://cveteval.call-learning.fr/',
    },
  ],
}
