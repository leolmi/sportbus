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
