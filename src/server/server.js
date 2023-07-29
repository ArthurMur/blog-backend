
import express from 'express'
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose
.connect('mongodb+srv://Arthur:TeamSESH2281337@cluster0.0ylbds4.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('MD OK!'))
.catch(err => console.log('DB error', err));

const app = express();


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);
    const token = jwt.sign({
        fullName: "Иванов Иванович",
        email: req.body.email,
    }, "secretkey");
    res.json({
        success: true,
        token
    });
});

app.listen(5173, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Server OK!');
});

