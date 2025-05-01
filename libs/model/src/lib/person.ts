import { PersonType } from './types';
import { guid } from '../generic.helper';

export class Person {
  constructor(i?: Partial<Person>) {
    this.code = i?.code||guid();
    this.name = i?.name||'New Person';
    this.type = i?.type||'athlete';
    this.group = i?.group||'';
  }

  code: string;
  name: string;
  type: PersonType;
  group: string;
}
