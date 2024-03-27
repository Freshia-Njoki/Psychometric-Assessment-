const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {routerManager} = require('./routes/rts');

//middlewares
app.use((req, res, next)=> {
  res.locals.username = "my Username";
  next();
})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.use('/',routerManager);
app.post('/users/:id', (req, res) => {
   res.status(200).send(req.params.id);
  })

  app.get('/', (req, res) => {
    res.send("welcome to CareerPASS API")
  })

app.listen(8081, () => {
    console.log("server running ")
})





