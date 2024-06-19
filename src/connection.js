import mongoose from "mongoose";

mongoose.connect('mongodb+srv://anasramzy00:9i2dsmBjqmFdUZYI@cluster0.usenaxw.mongodb.net/project')
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

const collection = new mongoose.model("users", loginSchema)

export default collection