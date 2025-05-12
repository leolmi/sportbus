import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CalendarItem, Person } from './common.schema';

@Schema()
class Group extends Document {
  /**
   * code
   */
  @Prop({ required: true })
  code: string;
  /**
   * nome
   */
  @Prop()
  name: string;
}

@Schema()
class Session extends Document {
  /**
   * identificativo
   */
  @Prop({ required: true })
  _id: string;
  /**
   * last-update
   */
  @Prop()
  lu: number;
  /**
   * code
   */
  @Prop({ required: true })
  code: string;
  /**
   * nome
   */
  @Prop()
  name: string;
  /**
   * description
   */
  @Prop()
  description: string;
  /**
   * icon
   */
  @Prop()
  icon: string;
  /**
   * Groups
   */
  @Prop()
  groups: Group[];
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
}

export const SessionSchema = SchemaFactory.createForClass(Session);
