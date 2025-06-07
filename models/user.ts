import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  createdAt: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      },
    },
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 