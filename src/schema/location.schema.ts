import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;
@Schema()
export class Location {
  @Prop()
  name: string;

  @Prop({ type: Object })
  location;

  @Prop({ type: Object })
  fullAddress;
}
export const locationSchema = SchemaFactory.createForClass(Location);
