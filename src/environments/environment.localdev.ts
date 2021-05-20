import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: false,
  mockServer: false,
  helpUrl: 'http://pedagogie.vetagro-sup.fr/Pages/CompetVet/co/guide-ts.html',
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
