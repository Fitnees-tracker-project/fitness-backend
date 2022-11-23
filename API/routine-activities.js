const express = require('express'); 
const routineActivitiesRouter = express.Router(); 
const {
    getRoutineActivityById,
    getRoutineById,
    updateRoutineActivity,
    destroyRoutineActivity
} = require ("../db/routine-activities"); 
routineActivitiesRouter.use((req, res, next ) => {
    console.log("request being made")
    next()
})

//PATCH /routineactivities/:routineActivityId 
routineActivitiesRouter.patch('/:routineactivityId', async (req, res, next) => {
    const {routineactivityId} = req.params
    const { count, duration } = req.body
    console.log('this is routineActivityId', routineactivityId)
    
try { 
    const updatedRoutineActivity = await updateRoutineActivity ({id: routineactivityId, count, duration})
    console.log(updatedRoutineActivity, "this is")
    res.send({ updatedRoutineActivity })
    } catch (error) {
        console.error(error.detail)
    }
})

//DELETE /routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', async (req, res, next) => {
    const { routineActivityId } = req.params
    console.log('this is routineActivityId', routineActivityId)
try {
    const routineActivity = await getRoutineActivityById (routineActivityId);
    const destroyActivityFromRoutine = await destroyRoutineActivity (routineActivityId)
res.send(destroyActivityFromRoutine);
//this part might be wrong
} catch (error){
    console.error(error.detail)
}
})

module.exports = routineActivitiesRouter;