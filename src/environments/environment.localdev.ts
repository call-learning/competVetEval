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
      id: 'ENVT  Test',
      name: 'ENVT Test',
      logo: 'assets/images/schools/logo-envt.png',
      // Test site for CAS
      moodleUrl: 'https://moodle-tdtp.envt.fr/',
    },
  ],
  encryptSalt: 'iirrogzrtgeqeybhr7k98imwfcs52g',
}
