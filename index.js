const connect = require('./db');
const express = require('express');
const cors = require('cors');
require("dotenv").config();

connect(); 
const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

app.get('/', function (req, res) {
 res.send("Hello World")
});

app.use('/authenticate', require('./routes/authentication'));
app.use('/tasks', require('./routes/tasks'));

app.listen(process.env.PORT || port, () => {
  console.log(`iNotebook listening on port`)
});