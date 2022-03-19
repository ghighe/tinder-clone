const express = require("express");
const {
    MongoClient
} = require('mongodb');
const {
    v4: uuidv4
} = require("uuid");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dbo = require('../server/db/conn');

const dbURL = 'mongodb+srv://ghighe:NM00sjiGLr3z5vIz@Cluster0.ytcoc.mongodb.net/Cluster0?retryWrites=true&w=majority'
const dbAccess = new MongoClient(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const PORT = 10000;

const app = express();
app.use(cors(), express.json());

app.listen(PORT, () => {
    console.log(`Server run on port ${PORT}`);
    dbo.connectToServer((error) => {
        if (error) {
            console.log("Cannot connect to MongoDatabase");
        }
    });
});

app.get("/", (req, res) => {
    res.json("Hello from server side");
})

app.post("/signup", async (req, res) => {
    const {
        email,
        password
    } = req.body //transfer the email and password from front to backend
    const generateUserId = uuidv4(); //generate unique id for our new user
    const standardizeEmail = email.toLowerCase();
    const hashPassword = await bcrypt.hash(password, 10); //hash the password
    //create the new user object
    const user = {
        user_id: generateUserId,
        email: standardizeEmail,
        hashed_password: hashPassword
    }

    //connect to MongoDB
   const dbConnect = dbo.getDb();
    dbConnect
        .collection('users')
        .findOne(
            {email},
            function (err, result) {
                //check if user exist and prevent from accessing onboard page
                if (result) {
                    res.status(500).send("User already exist, please login");
                }else {
                    //if the used does not exist add it in database
                    dbConnect
                    .collection('users')
                    .insertOne(user, function (error) {
                        if (error) {
                            res.status(400).send("Error inserting user ", error);
                        } else {
                            const token = jwt.sign(user, standardizeEmail, {
                                expiresIn: 60 * 24,
                            });
                            res.status(200).json({
                                token,
                                userId: generateUserId
                            });
                        }
                    })
                }
            }
        )
})

app.post("/login", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');

        //find the user in the database based on email
        const user = await users.findOne({
            email
        });
        //check the hashing of the stored password with the pass entered by user
        const matchedPassword = await bcrypt.compare(password, user.hashed_password);
        if (user && matchedPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(200).json({
                token,
                userId: user.user_id
            })
        } else {
            res.status(400).send("Invalid credentials");
        }
    } catch (error) {
        console.log(error);
    } finally {
        await dbAccess.close();
    }
})

app.get("/gendered-users/:gender", async (req, res) => {
    const selectedGender = req.params.gender;
    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');
        //query based on the gender
        const query = {
            gender_identity: { //query to looks to those users which are women or man
                $eq: selectedGender
            }
        };
        const genderedUsers = await users.find(query).toArray();
        res.send(genderedUsers);
    } catch (error) {
        console.log(error);
    } finally {
    //await dbAccess.close();
    }
});


app.get("/user/:id", async (req, res) => {
    //get the id from the url
    const userId = req.params.id;
    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');

        const query = {
            user_id: userId
        };
        const user = await users.findOne(query);
        res.send(user);
    } catch (error) {
        console.log(error);
    } finally {
       // await dbAccess.close();

    }
});


//update a user
app.put("/user", async (req, res) => {
    //formData we get from put request with the axios help
    const formData = req.body.formData;

    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');
        const query = {
            user_id: formData.user_id
        }
        const updateUser = {
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            }
        }
        const updatedUser = await users.updateOne(query, updateUser);
        res.send(updatedUser);
    } catch (error) {
        console.log(error);
    } finally {
        await dbAccess.close();
    }
})

app.put("/addmatch", async(req,res) => {
    const {userId, matchUserId} = req.body;
    const query = {user_id:userId};
    const updateDocument = {
    $push:{matches: {user_id:matchUserId}}
    }
    const dbConnect = dbo.getDb();
    dbConnect
    .collection('users')
    .updateOne(query,updateDocument, (error) => {
        if(error) {
           res.status(400).send("Document was not updated!")
        }else {
            res.status(200).send("Update OK!");
        }
    })
})

app.get("/users", async (req,res) => {
    const userIds = JSON.parse(req.query.userIds);
    const dbConnect = dbo.getDb();
    const dbUsers = dbConnect.collection('users')

    const pipeline = [
        {
            '$match':{
                'user_id': {'$in':userIds}
            }
        }
    ]

    const foundUsers = await dbUsers.aggregate(pipeline).toArray()
    console.log(foundUsers);
    res.send(foundUsers);
})