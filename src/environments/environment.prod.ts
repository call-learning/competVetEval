import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: true,
  mockServer: false,
  helpUrl: 'http://pedagogie.vetagro-sup.fr/Pages/CompetVet/co/guide-ts.html',
  schoolConfigUrl:
    'https://competveteval.s3.eu-west-3.amazonaws.com/schools.json',
  schools: [
    {
      id: 'enva',
      name: 'EnvA',
      logo: 'assets/images/schools/logo-enva.png',
      moodleUrl: 'https://eve.vet-alfort.fr/',
    },
    {
      id: 'oniris',
      name: 'Oniris',
      logo: 'assets/images/schools/logo-oniris.png',
      moodleUrl: 'https://connect.oniris-nantes.fr/',
    },
    {
      id: 'envt',
      name: 'envt',
      logo: 'assets/images/schools/logo-envt.png',
      moodleUrl: 'https://moodle.envt.fr/',
    },
    {
      id: 'vet-agro-sup',
      name: 'VetAgro Sup',
      logo: 'assets/images/schools/logo-vetagro.png',
      moodleUrl: 'https://vetagrotice.vetagro-sup.fr/',
    },
  ],
  encryptSalt: 'iirrogzrtgeqeybhr7k98imwfcs52g',
}
