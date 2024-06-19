import  mongoose , { Schema , model} from "mongoose";


const pictureSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  sentAt: { type: Date, default: Date.now },
  result: {
    type: String,
    enum: ['normal', 'included_with_diseases']
  }
}, { timestamps: true });




export const User = model("users", pictureSchema)
export default User