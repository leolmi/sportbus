import { guid } from '../generic.helper';

export class Person {
  constructor(i?: Partial<Person>) {
    this.code = i?.code||guid();
    this.name = i?.name||'New Person';
    this.group = i?.group||'';
    this.isDriver = !!i?.isDriver;
  }

  code: string;
  name: string;
  group: string;
  isDriver: boolean;
}
