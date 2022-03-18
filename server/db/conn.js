const {MongoClient} = require("mongodb");


const dbURL = 'mongodb+srv://ghighe:NM00sjiGLr3z5vIz@Cluster0.ytcoc.mongodb.net/Cluster0?retryWrites=true&w=majority';
const dbAccess = new MongoClient(dbURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
    connectToServer: function(callback) {
        dbAccess.connect(function(err,db) {
            if(err || !db) {
                return callback(err);
            }

        dbConnection = db.db('app-data');
        console.log("Successfully connected to MongoDB.");

        return callback();
        });
    },

    getDb: function() {
        return dbConnection;
    }
}