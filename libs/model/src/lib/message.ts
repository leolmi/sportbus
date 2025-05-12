
export class Message {
  constructor(i?: Partial<Message>) {
    this.owner = i?.owner||'';
    this.text = i?.text||'';
    this.date = i?.date||0;
  }

  owner: string;
  text: string;
  date: number;
}
