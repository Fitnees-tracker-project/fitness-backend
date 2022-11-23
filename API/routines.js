const express = require('express');
const routinesRouter = express.Router();
const jwt = require('jsonwebtoken');
const { getRoutine, getAllPublicRoutines } = require('../db/routines')
const {requireUser} = require('../API/utils')
const {createRoutine, updateRoutine, destroyRoutine} = require('../db/routines')
const {addActivityToRoutine} = require('../db/routine-activities')

routinesRouter.use((req, res, next) => {
    console.log('A request is being made to /routines')
    next()
})

//TEST ROUTE
// routinesRouter.get('/', (req, res, next) => {
//     res.send({
//         message: "Welcome to /routines :D"
//     })
// })


// GET /routines
routinesRouter.get('/', async (req, res, next) => {
    // THIS WILL NEED ACTIVITIES AFTER 
    //WORKING FOR NOW(COME BACK)
    try {
        const routines = await getRoutine();
        res.send({
            routines
        })
    } catch (error) {
        console.log(error)
    }
})
// POST /routines *
routinesRouter.post('/', async (req, res) => {
    // WORKING-- ADD REQUIRES SIGN IN LATER
    const { isPublic, name, goal } = req.body
    const postData = {}
    try {
    //    postData.creatorId = req.user.id
       postData.name = name
       postData.goal = goal
       postData.isPublic = isPublic
       const post = await createRoutine(postData)
       if(post){
        res.send({post})
       }else{
        res.send({
            name: "failedToCreatePostError",
            message: "Get better nerd"
        })
       }
    } catch (error) {
        console.log(error)
    }
})
// PATCH /routines/:routineId
routinesRouter.patch('/:routineId', async (req, res, next) => {
    //WORKING
    const {routineId} = req.params
    const {isPublic, name, goal} = req.body
    console.log('this is routineId', routineId)
   try {
    const updatedRoutine = await updateRoutine({id: routineId, isPublic, name, goal})
    console.log(updatedRoutine)
    const routines = await getAllPublicRoutines()
    res.send({
        routines
    })
   } catch (error) {
    console.error(error.detail)
   }
})
//DELETE /routines/:routineId
routinesRouter.delete('/:routineId', async (req, res, next) => {
    //WORKING
    const {routineId} = req.params
    console.log('this is routineId', routineId)
 try {
    const deletedRoutine = await destroyRoutine(routineId)
    const routines = await getAllPublicRoutines();
    res.send({
        routines
    })
 } catch (error) {
    console.error(error.detail)
 }
})
// POST /routines/:routineId/activities
routinesRouter.post('/:routineid/activities', async (req, res, next) => {
    // WORKING
    const {routineid} = req.params
    const {activityid, count, duration} = req.body
    console.log('this is routineId', routineid)

    try {
        const newAct = await addActivityToRoutine({routineid, activityid, count, duration})
        res.send({
            newAct
        })
    } catch (error) {
        console.error(error.deatil)
    }
})

module.exports = routinesRouter;