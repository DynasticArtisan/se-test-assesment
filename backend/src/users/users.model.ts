import mongoose from "mongoose";

export type UserDoc = mongoose.Document & {
  email: string;
  name: string;
};

const UserSchema = new mongoose.Schema<UserDoc>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

export const Users = mongoose.model<UserDoc>('User', UserSchema);