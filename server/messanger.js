const express = require ('express');
const bodyParser = require ('body-parser');
const { MongoClient } = require('mongodb');
const redis = require('redis');
const client = redis.createClient();

//mongo init
const url = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(url);

mongoClient.connect( (err) => {
    if (err) console.log(err);
    const db = mongoClient.db('test');
    //move app logic in here

    const app = express();
    app.use(bodyParser.json());

    app.post( '/messanger/postMessage', (req, res) => {
    console.log(req.body);
    db.collection('testing').insertOne({ data : req.body.message })
    .then( () => {
        console.log('db inserted worked')
    }).catch ( (e) => { console.log(e);
    }); 
    client.publish('testPublish', req.body.message); //to publish a redis channel

    
    res.send('ok');

 });

 app.get('/messanger/getMessages', (req, res) => {
    db.collection('testing').find({}).toArray()
      .then((result) => {
        res.send(result.map(r => r.data));
      })
      .catch((e) => console.log(e));
  });

    app.listen(5000);
    //end app logic

});


