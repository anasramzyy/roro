import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017')
.then(() => {
  console.log("mongodb connected")
})
.catch(() => {
  console.log("failed to connect")
})

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const pictureSchema = new mongoose.Schema({
  picture: Buffer,
  sentAt: { type: Date, default: Date.now },
  result: {
    type: String,
    enum: ['normal', 'included_with_diseases']
  }
}, { timestamps: true });

const collection = new mongoose.model("users", loginSchema)

export default collection