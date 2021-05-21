import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: true,
  mockServer: false,
  helpUrl: 'http://pedagogie.vetagro-sup.fr/Pages/CompetVet/co/guide-ts.html',
  schools: [
    {
      id: 'enva',
      name: 'EnvA',
      logo: 'assets/images/schools/logo-enva.png',
      moodleUrl: 'https://vet-alfort.call-learning.io/',
      // moodleUrl: 'https://eve.vet-alfort.fr/',
    },
    {
      id: 'oniris',
      name: 'Oniris',
      logo: 'assets/images/schools/logo-oniris.png',
      moodleUrl: 'https://oniris-nantes.call-learning.io/',
      // moodleUrl: 'https://connect.oniris-nantes.fr/',
    },
    {
      id: 'envt',
      name: 'envt',
      logo: 'assets/images/schools/logo-envt.png',
      moodleUrl: 'https://envt.call-learning.io/',
      // moodleUrl: 'https://moodle.envt.fr/',
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
