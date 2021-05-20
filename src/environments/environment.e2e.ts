import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: false,
  mockServer: true,
  helpUrl: 'http://pedagogie.vetagro-sup.fr/Pages/CompetVet/co/guide-ts.html',
  schools: [
    {
      id: 'mock-api-instance',
      name: 'Mocked API instance',
      logo: 'assets/images/schools/logo-calllearning.png',
      moodleUrl: 'https://moodle.local',
    },
  ],
}
