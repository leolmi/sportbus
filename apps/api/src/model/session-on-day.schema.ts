import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Person } from './common.schema';



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
   * mappa dei passeggeri presenti
   */
  @Prop({ type: Object })
  passengersMap: any;
  /**
   * session
   */
  @Prop()
  shuttles: Shuttle[];
}

export const SessionOnDaySchema = SchemaFactory.createForClass(SessionOnDay);
