import { IEnvironment } from './ienvironment'

export const environment: IEnvironment = {
  production: false,
  mockServer: true,
  schools: [
    {
      id: 'mock-api-instance',
      name: 'Mocked API instance',
      logo: 'assets/images/schools/logo-calllearning.png',
      moodleUrl: 'https://moodle.local',
    },
  ],
}
