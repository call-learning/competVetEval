export class School {
  id: string;
  name: string;
  logo: string;
  moodleUrl: string;

  constructor(input: any) {
    Object.assign(this, input);
  }
}
