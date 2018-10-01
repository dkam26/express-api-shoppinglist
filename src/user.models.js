import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  firstname: String,
  secondname: String,
  password: String,
  lists: [{type: Schema.Types.ObjectId, ref: 'Shoppinglist'}],
});

const User = mongoose.model('User', UserSchema);

export default User;
