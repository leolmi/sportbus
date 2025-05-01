
export class Message {
  constructor(i?: Partial<Message>) {
    this.owner = i?.owner||'';
    this.session = i?.session||'';
    this.text = i?.text||'';
    this.date = i?.date||0;
  }

  session: string;
  owner: string;
  text: string;
  date: number;
}
