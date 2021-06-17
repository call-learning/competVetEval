import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: true,
  mockServer: false,
  helpUrl: 'http://pedagogie.vetagro-sup.fr/Pages/CompetVet/co/guide-ts.html',
  schoolConfigUrl:
    'https://storage.gra.cloud.ovh.net/v1/AUTH_712bdfd2d9f54965a0c6ecdd05621098/competveteval/',
  schools: [
    {
      id: 'enva',
      name: 'EnvA',
      logo: 'assets/images/schools/logo-enva.png',
      moodleUrl: 'https://vet-alfort.call-learning.io/',
    },
    {
      id: 'oniris',
      name: 'Oniris',
      logo: 'assets/images/schools/logo-oniris.png',
      moodleUrl: 'https://oniris-nantes.call-learning.io/',
    },
    {
      id: 'envt',
      name: 'envt',
      logo: 'assets/images/schools/logo-envt.png',
      moodleUrl: 'https://envt.call-learning.io/',
    },
    {
      id: 'vet-agro-sup',
      name: 'VetAgro Sup',
      logo: 'assets/images/schools/logo-vetagro.png',
      moodleUrl: 'https://vetagro-sup.call-learning.io/',
    },
  ],
  // moodleUrl: 'https://vetagrotice.vetagro-sup.fr/',
  // moodleUrl: 'https://connect.oniris-nantes.fr/',
  // moodleUrl: 'https://moodle.envt.fr/',
  // moodleUrl: 'https://eve.vet-alfort.fr/',
  encryptSalt: 'iirrogzrtgeqeybhr7k98imwfcs52g',
}
