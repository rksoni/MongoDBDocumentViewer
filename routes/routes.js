var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;


// var server = new Server('localhost', 27017, {auto_reconnect: true});
// db = new Db('hackdb', server, {safe: true});

// db.open(function(err, db) {
//     if(!err) {
//         console.log("Connected to 'hackdb' database");
//         db.collection('donors', {safe:true}, function(err, collection) {
//             if (err) {
//                 console.log("The collection doesn't exist. Creating it with sample data...");

//             }
//         });
//     }
// });



exports.queryDB = function(req, res) {
    console.log('req.body', req.body);
    console.log('db host', req.body.host);
    console.log('db port', req.body.port);
    console.log('db collection', req.body.collection);
    console.log('db db', req.body.db);
    console.log('db user', req.body.user);
    console.log('db password', req.body.password);
    console.log('db query _id:', req.body.query);

    var server = new Server(req.body.host+'.qa.paypal.com', req.body.port, {auto_reconnect: true});
    db = new Db(req.body.db, server, {safe: true});

    db.open(function(err, db) {
        if(!err) {
            console.log("Connected to 'comp' database");
            db.authenticate(req.body.user, req.body.password, function(err, result) {
                    if(err){
                        console.log("authentication error :", err);
                    }
                    console.log('querying the DB :', req.body.query);
                    var cursor = null;
                    if(req.body.query){
                        console.log('querying with key');
                        cursor = db.collection(req.body.collection).find({"_id":req.body.query});
                    } else {
                        console.log('querying with no key');
                        cursor = db.collection(req.body.collection).find();
                    }
                    cursor.each(function(err, doc) {
                        if (doc != null) {
                            console.log('document :', doc);
                            res.writeHead(200, { "Content-Type": "application/json" });
                            //var response = {'x':'2'};
                            res.end(JSON.stringify(doc));
                        } else {
                            console.log('doc is null');
                        }
                        if(err){
                            console.log('error : ', err);
                        }

                    });
            });
        } else {
            console.log('error : ', err);
        }
    });
};