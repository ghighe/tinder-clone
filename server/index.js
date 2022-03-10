const express = require("express");
const {MongoClient} = require('mongodb');
const {v4: uuidv4} = require("uuid");
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const dbURL = 'mongodb+srv://ghighe:NM00sjiGLr3z5vIz@Cluster0.ytcoc.mongodb.net/Cluster0?retryWrites=true&w=majority'
const dbAccess = new MongoClient(dbURL);
const PORT = 10000;

const app = express();
app.use(cors(),express.json());

app.listen(PORT, () => console.log(`Server run on port ${PORT}`));

app.get("/", (req, res) => {
    res.json("Hello from server side");
})

app.post("/signup", async (req, res) => {
    console.log(req.body);
    const {email, password} = req.body //transfer the email and password from front to backend
    const generateUserId = uuidv4(); //generate unique id for our new user
    const standardizeEmail = email.toLowerCase();
    const hashPassword = await bcrypt.hash(password, 10); //hash the password
    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');
        const existingUser = await users.findOne({email});
        //check if a user already exist
        if (existingUser) {
            return res.status(489).send("User already exist, please logIn");
        }

        //constructing the user object to send it to database

        const user = {
            user_id: generateUserId,
            email: standardizeEmail,
            password: hashPassword
        }
       const insertedUser =  await users.insertOne(user);
       const token = jwt.sign(insertedUser,standardizeEmail, {
           expiresIn:60*24,
       })

       res.status(201).json({token,
        userId:generateUserId,
        email:standardizeEmail})

    } catch (error) {
        console.log(error);
    } finally {
        dbAccess.close();
    }
})

app.get("/users", async (req, res) => {


    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');
        const getUsers = await users.find().toArray();
        res.send(getUsers);
    } catch (error) {
        console.log(error);
    } finally {
        await dbAccess.close();
    }
})