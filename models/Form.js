import { Schema, model } from 'mongoose';

const formSchema = new Schema({
  name: String,
  email: String,
  receiptNo : String,
  classN : String , 
  rollNo : String,
  receiptImageUrl: String,
  accepted: Boolean,
  rejected:Boolean,
  Entered:Boolean,
  // other form fields
});

export default model('Form', formSchema);
