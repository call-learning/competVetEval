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
      id: 'vet-agro-sup',
      name: 'VetAgro Sup',
      logo: 'assets/images/schools/logo-vetagro.png',
      // Test site
      moodleUrl: 'https://vetagro-sup.call-learning.io/',
      // moodleUrl: 'https://vetagrotice.vetagro-sup.fr/',
    },
  ],
}
