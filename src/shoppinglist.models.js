import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const shoppinglistSchema = new Schema({
  name: String,
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
});


const Shoppinglist = mongoose.model('Shoppinglist', shoppinglistSchema);


export default Shoppinglist;
