const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const fs = require('fs-extra');
const fileUpload = require('express-fileupload');

const port = process.env.PORT || 7000
// console.log(process.env.DB_USER)

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('product'));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World How are you!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zcidc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zcidc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  // console.log( 'connection error' ,err)
  const productCollection = client.db("shoppingCart").collection("products");
  const ordersCollection = client.db("shoppingCart").collection("orders");
  const contactCollection = client.db("shoppingCart").collection("contact");
  const blogCollection = client.db("shoppingCart").collection("blogs");
  const adminCollection = client.db("shoppingCart").collection("admin");

  // console.log('dt bse connected successfully')



  ///////// Product Collection is start\\\\\\\\\

  
app.post('/addProduct', (req, res) => {
    const file = req.files.file;

    const name = req.body.name;
    const price = req.body.price;
    const email = req.body.email;
    // console.log(file, name, email, price);
    // const filePath = `${__dirname}/product/${file.name}`;
    // file.mv(filePath, err => {
    //     if (err) {
    //         console.log(err)
    //         res.status(500).send({ msg: 'Failed to upload Image' });
    //     }
        // const newImg = fs.readFileSync(filePath);

        // const newImg = req.files.file.data;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        }

        productCollection.insertOne({price, name, email, image })
            .then(result => {

                // fs.remove(filePath, error => {
                //     if (error) {
                //         // console.log(error)
                //         res.status(500).send({ msg: 'Failed to upload Image' });
                //     }
                    res.send(result.insertedCount > 0);

                // })
            })
    // })
})

app.get('/products', (req, res) => {
  productCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
});

app.delete('/delete/:id', (req, res) => {
  productCollection.deleteOne({_id: ObjectId (req.params.id)})
  // console.log(req.params.id)
  .then(result => {
    console.log(result)
  })
  // console.log(req.params.id)
})

  ///////// Product Collection is end\\\\\\\\\



  ///////// Order Collection is start\\\\\\\\\

app.post('/addOrder', (req, res)=>{
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
      // console.log(result);
      res.send(result.insertedCount > 0)
  })
})

app.get('/orderItem', (req, res)=>{
    ordersCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    } )
})

app.delete('/delete2/:id', (req, res) => {
    ordersCollection.deleteOne({_id: ObjectId (req.params.id)})
    // console.log(req.params.id)
    .then(result => {
      console.log(result)
    })
    // console.log(req.params.id)
  })

  ///////// Order Collection is end\\\\\\\\\


  ///////// Contact Collection is start\\\\\\\\\

  app.post('/addContact', (req, res) =>{

    const email = req.body.email;

    const subject = req.body.subject;

    const description = req.body.description;

    // console.log(  email, subject, description);

    contactCollection.insertOne({email, subject, description })
    .then(result =>{
      // console.log('inserted count', result)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/contactItem', (req, res)=>{
    contactCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    } )
})

app.delete('/delete3/:id', (req, res) => {
  contactCollection.deleteOne({_id: ObjectId (req.params.id)})
  // console.log(req.params.id)
  .then(result => {
    console.log(result)
  })
  // console.log(req.params.id)
})

  ///////// Blog Collection is start\\\\\\\\\

app.post('/addBlog', (req, res) =>{

  const name = req.body.name;

  const address = req.body.address;

  const information = req.body.information;

  // console.log(  email, subject, description);

  blogCollection.insertOne({name, address, information })
  .then(result =>{
    // console.log('inserted count', result)
    res.send(result.insertedCount > 0)
  })
})

app.get('/blogItem', (req, res)=>{
  blogCollection.find({})
  .toArray((err, documents) => {
    res.send(documents)
  } )
})

app.delete('/delete4/:id', (req, res) => {
  blogCollection.deleteOne({_id: ObjectId (req.params.id)})
  // console.log(req.params.id)
  .then(result => {
    console.log(result)
  })
  // console.log(req.params.id)
})

  ///////// Blog Collection is end\\\\\\\\\


  ///////// Admin Collection is start\\\\\\\\\

  app.post('/addEmail', (req, res) =>{

    const email = req.body.email;
  
    // console.log(  email);
  
    adminCollection.insertOne({email})
    .then(result =>{
      // console.log('inserted count', result)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/getEmail', (req, res)=>{
    adminCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    } )
  })

  app.get('/isAdmin', (req, res) => {
    // console.log(req)
    const email = req.query.email;
    // console.log(req.query.email)
    adminCollection.find({email: email})
    .toArray((err, admins) =>{
      res.send(admins.length > 0)
    })
  })

  ///////// Admin Collection is start\\\\\\\\\


  ///////// Alhamdulilla all Collection is over\\\\\\\\\

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})