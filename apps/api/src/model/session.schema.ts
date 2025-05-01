import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
class Person extends Document {
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
   * type
   */
  @Prop()
  type: string;
  /**
   * group
   */
  @Prop()
  group: string;
}

@Schema()
class CalendarItem extends Document {
  /**
   * day of week (0-6) (dom-sab)
   */
  @Prop()
  dayOfWeek: number;
  /**
   * start
   */
  @Prop()
  start: number;
  /**
   * end
   */
  @Prop()
  end: number;
  /**
   * target
   */
  @Prop()
  target: string;
  /**
   * group
   */
  @Prop()
  group: string;
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
   * last update date
   * (dopo 90gg di inattività viene elimionata)
   */
  @Prop()
  lastUpdate: number;
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
