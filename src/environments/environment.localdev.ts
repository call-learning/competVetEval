import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: false,
  mockServer: false,
  helpUrl: 'http://pedagogie.vetagro-sup.fr/Pages/CompetVet/co/guide-ts.html',
  schoolConfigUrl:
    'https://competveteval.s3.eu-west-3.amazonaws.com/schools.json',
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
    {
      id: 'vet-agro-sup',
      name: 'VetAgro Sup',
      logo: 'assets/images/schools/logo-vetagro.png',
      // Test site
      moodleUrl: 'https://vetagro-sup.call-learning.io/',
    },
  ],
  encryptSalt: 'iirrogzrtgeqeybhr7k98imwfcs52g',
}
