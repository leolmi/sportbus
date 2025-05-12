import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Person extends Document {
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
   * group
   */
  @Prop()
  group: string;
  /**
   * isDriver
   */
  @Prop()
  isDriver: boolean;
}

@Schema()
export class CalendarItem extends Document {
  /**
   * code
   */
  @Prop()
  code: string;
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
