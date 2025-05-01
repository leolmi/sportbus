import { guid } from '../generic.helper';

export class Group {
  constructor(g?: Partial<Group>) {
    this.name = g?.name||'New Group';
    this.code = g?.code||guid();
  }

  name: string;
  code: string;
}
