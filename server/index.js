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
app.use(cors(), express.json());

app.listen(PORT, () => console.log(`Server run on port ${PORT}`));

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
    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');
        const existingUser = await users.findOne({
            email
        });
        //check if a user already exist
        if (existingUser) {
            return res.status(489).send("User already exist, please logIn");
        }

        //constructing the user object to send it to database

        const user = {
            user_id: generateUserId,
            email: standardizeEmail,
            hashed_password:hashPassword
        }
        const insertedUser = await users.insertOne(user);
        const token = jwt.sign(insertedUser, standardizeEmail, {
            expiresIn: 60 * 24,
        })

        res.status(201).json({
            token,
             userId: generateUserId,
            // email: standardizeEmail
        })

    } catch (error) {
        console.log(error);
    } finally {
        await dbAccess.close();
    }
})

app.post("/login", async (req, res) => {
    const {email,password} = req.body;

    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');

        //find the user in the database based on email
        const user = await users.findOne({
            email
        });
        //check the hashing of the stored password with the pass entered by user
        const matchedPassword  = await bcrypt.compare(password, user.hashed_password);
        if (user && matchedPassword) {
            const token = jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(201).json({
                token,
                userId:user.user_id
            })
        }else {
            res.status(400).send("Invalid credentials");
        }
    } catch (error) {
        console.log(error);
    } finally {
        await dbAccess.close();
    }
})

app.get("/gendered-user/:gender", async (req, res) => {
    const selectedGender = req.params.gender;
    try {
        await dbAccess.connect();
        const database = dbAccess.db('app-data');
        const users = database.collection('users');
        //query based on the gender
        const query = {gender_interest:{$eq: selectedGender}};
        const genderedUsers = await users.find(query).toArray();
        res.send(genderedUsers);
    }catch(error){
        console.log(error);
    }
     finally {
     await dbAccess.close();
}
});


app.get("/user/:id", async (req,res) => {
    //get the id from the url
    const userId = req.params.id;

    try {
       await dbAccess.connect();
       const database = dbAccess.db('app-data');
       const users = database.collection('users');

       const query = {user_id:userId};
       const user = await users.findOne(query);
       res.send(user);
    } catch (error) {
        console.log(error);
    }finally {
      await dbAccess.close();
    }
});


//update a user
app.put("/user",async (req,res) => {
    //formData we get from put request with the axios help
    const formData = req.body.formData;

    try {
       await dbAccess.connect();
       const database = dbAccess.db('app-data');
       const users = database.collection('users');
       const query = {user_id: formData.user_id}
       const updateUser = {
           $set: {
               first_name:formData.first_name,
               dob_day:formData.dob_day,
               dob_month:formData.dob_month,
               dob_year:formData.dob_year,
               show_gender:formData.show_gender,
               gender_identity:formData.gender_identity,
               gender_interest:formData.gender_interest,
               url:formData.url,
               about:formData.about,
               matches:formData.matches
           }
       }
       const updatedUser = await users.updateOne(query,updateUser);
       res.send(updatedUser);
    } catch (error) {
        console.log(error);
    }finally {
       await dbAccess.close();
    }
})