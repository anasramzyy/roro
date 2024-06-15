import express from 'express'
import session from 'express-session'
import multer from 'multer'
const app = express()
import path from 'path'
import sharp from 'sharp'
import tf from '@tensorflow/tfjs'
import bcrypt from 'bcryptjs'
import collection from './connection.js'

const upload = multer({ dest: '/uploads/' });
const port = 5000


app.use(express.json())

app.use(express.urlencoded({extended: false}))

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", 'ejs')

app.use(express.static("puplic"))

app.get('/', (req, res) => {
  res.render('login')
})


app.get('/signup', (req, res) => {
  res.render('signup')
})

app.get('/scan', (req, res)=> {
  res.render('scanner')
})

//Patient History
app.get("/history", async (req, res) => {
  const user = await collection.findOne({ id: req.id.user_id });
  const history = user.history; // Modify this depending on the key name

  // Render whatever view you have to view in the next page
});


// Logout & Add session destroying
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/login");
    }
  });
});


app.post("/history", async (req, res) => {

  const data = {}; // frontend data
});


app.post('/signup', async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password
  }

  const existingUser = await collection.findOne({email: data.email})

  if(existingUser) {
    res.send("User already exists. please choose a different username.")
  } else {
    const saltRounds = 8
    const hashedPassword = await bcrypt.hash(data.password, saltRounds)

    data.password = hashedPassword
    const userData = await collection.insertMany(data)
    console.log(userData)
  }
})


app.post('/login', async (req, res) => {
  try {
    const check = await collection.findOne({email: req.body.email})
    if (!check) {
      res.send("email not found")
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, check.password)
    if (!isPasswordMatch) {
      res.render('home')
    } else {
      res.send('wrong password')
    }
  } catch {
    res.send('wrong details')
  }
}) 


app.post('/scan', upload.single('file'), async (req, res) => {
  
  //the ai model
  const model = await tf.loadLayersModel('https://fastapi-lung-cancer.onrender.com/docs#/default/predict_image_predict_post');
  try {
    // Preprocess the image
    const image = await sharp(req.file.buffer)
      .resize(224, 224)
      .toBuffer();
    const tensor = tf.tensor3d(image, [1, 224, 224, 3]);

    // Make predictions using the model
    const predictions = model.predict(tensor);
    const prediction = predictions.dataSync()[0];

    // Return the prediction result
    res.json({ prediction: prediction > 0.5? 'included_with_diseases' : 'normal' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))