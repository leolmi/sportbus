import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CalendarItem, Person } from './common.schema';


@Schema()
class Shuttle extends Document {
  /**
   * code
   */
  @Prop({ required: true })
  code: string;
  /**
   * driver
   */
  @Prop()
  direction: string;
  /**
   * time
   */
  @Prop()
  time: number
  /**
   * target della navetta
   */
  @Prop()
  target: string;
  /**
   * driver
   */
  @Prop()
  driver: string;
  /**
   * passengers
   */
  @Prop([String])
  passengers: string[];
  /**
   * mappa degli orari per passeggero
   */
  @Prop({ type: Object })
  passengersTimesMap: any;
}

@Schema()
class Message extends Document {
  /**
   * data-ora del messaggio
   */
  @Prop({ required: true })
  date: number;
  /**
   * proprietario
   */
  @Prop({ required: true })
  owner: string;
  /**
   * testo
   */
  @Prop()
  text: string;
}


@Schema()
class SessionOnDay extends Document {
  /**
   * last-update
   */
  @Prop()
  lu: number;
  /**
   * date
   */
  @Prop({ required: true })
  date: number;
  /**
   * session
   */
  @Prop({ required: true })
  session: string;
  /**
   * Persons
   */
  @Prop()
  persons: Person[];
  /**
   * calendar
   */
  @Prop()
  calendar: CalendarItem[];
  /**
   * mappa dei passeggeri presenti
   */
  @Prop({ type: Object })
  passengersMap: any;
  /**
   * session
   */
  @Prop()
  shuttles: Shuttle[];
  /**
   * messaggi
   */
  @Prop()
  messages: Message[];
}

export const SessionOnDaySchema = SchemaFactory.createForClass(SessionOnDay);
