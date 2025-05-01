import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



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
   * athletes
   */
  @Prop([String])
  athletes: string[];
  /**
   * mappa degli orari per atleta
   */
  @Prop({ type: Object })
  athletesTimesMap: any;
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
   * mappa degli atleti presenti
   */
  @Prop({ type: Object })
  athletes: any;
  /**
   * session
   */
  @Prop()
  shuttles: Shuttle[];
}

export const SessionOnDaySchema = SchemaFactory.createForClass(SessionOnDay);
