const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { getUserByUsername, createUser, getUser } = require('../db/users')
const { JWT_SECRET } = process.env
const bcrypt = require('bcrypt')
const {getAllRoutinesByUser, getPublicRoutinesByUser, getAllPublicRoutines} = require('../db/routines')

usersRouter.use((req, res, next) => {
    console.log('a request is being made to /users!')
    next();
})

// Test Route
usersRouter.get('/', (req, res, next) => {
    res.send({
        message: 'welcome'
    })
})

//POST /api/users/login
//WORKING
usersRouter.post('/login', async (req, res, next) => {
   const {username, password} = req.body;
   if(!username || !password){
    next({
        name: 'MissingInfoError',
        message: 'Need both a username and password'
    })
   }
   try {
    const user = await getUserByUsername(username)
    //const passwrd = bcrpy.verify()
    const rPassword = await bcrypt.compare(password, user.password)

    // console.log(rPassword)

    if(user && rPassword){
        const token = jwt.sign( {id: user.id, username: user.username}, JWT_SECRET)
        delete user.password
        res.send({message: 'You are logged in', token:token, user})
    } else{
        next({
            name: "InccorectInfo",
            message: "Username or password is wrong"
        })
    }
   } catch (error) {
        console.log(error)
   }
})


//POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    // WORKING
    const { username, password } = req.body
    try {
        const user = await getUserByUsername(username)

        if(user){
            next({
                name: "userExiststError",
                message: "A user with that name already exists."
            })
        }

        const newUser = await createUser({
            username,
            password
        })


        const token = jwt.sign({
            id: newUser.id,
            username
        }, JWT_SECRET)
        res.send({
            message: 'Welcome to your new account',
            token
        })
    } catch (error) {
        console.log(error)
    }
})

//GET /api/users/me
usersRouter.get('/me', async (req, res, next) => {
    //Send back the logged-in user's data if a valid token is supplied in the header.
    const token = // CANT GET TOKEN
    console.log('this is token', token)
    try {
       if(token){
        res.send({
            username,
            id
        })
       } else {
        res.send({
            name: "NoAuthorizationError",
            message: "You need a valid login token to see this page!"
        })
       }
    } catch (error) {
        console.error(error.detail)
    }
})


// GET /api/users/:username/routines
usersRouter.get('/:userId/routines', async (req, res, next) => {
    // WORKING
    const userId = req.params
    // console.log('this is userId', userId.userId)
    const pubRoutines = await getPublicRoutinesByUser(userId.userId)
    console.log(pubRoutines)
    try {
        res.send({
            pubRoutines
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = usersRouter;