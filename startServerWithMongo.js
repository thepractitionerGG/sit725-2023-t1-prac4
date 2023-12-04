let express = require('express');
let app = express();
let cors= require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb://localhost:27017";
let port = process.env.port || 3000;
let collection;
app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function runDBConnection() {
    try {
        await client.connect();
        collection = client.db().collection('Cat');
    } catch(ex) {
        console.error(ex);
    }
}

app.get('/', function (req,res) {
    res.render('indexMongo.html');
});

app.get('/api/cats', async (req,res) => {
    try{
        let allcats = await collection.find({}).toArray()
        res.json({statusCode:200, data:allcats, message:'get all cats successful'});
    }catch(e){
        res.json({statusCode:400, data:e, message:'get all cats error'});

    }


    // getAllCats((err,result)=>{
    //     if (!err) {
    //         res.json({statusCode:200, data:result, message:'get all cats successful'});
    //     }
    // });
});

app.post('/api/cat', async (req,res)=>{
    let cat = req.body;
    try{
       let result =  collection.insertOne(cat);
        res.json({statusCode:201, data:result, message:'success'});
    }
    catch(e){
        res.json({statusCode:400, data:e, message:'failed'});
    }
});


app.listen(port, ()=>{
    console.log('express server started',port);
    runDBConnection();
});