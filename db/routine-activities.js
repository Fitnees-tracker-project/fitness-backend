const { client } = require ('./index')

async function getRoutineActivityById(id) {
    try {
        const { rows: [routine_activity] } = await client.query(`
        SELECT *
        FROM routineactivities
        WHERE id = $1;
        `, [id]);

        return routine_activity;
    } catch (error) {
        console.log("test error" + error)
        throw error; 
    }
}

async function addActivityToRoutine ({ 
    routineid, 
    activityid, 
    count, 
    duration}) {
    try {
        const { rows: [routine_activity] } = await client.query (`
        INSERT INTO routineactivities ("routineid", "activityid", count, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [routineid, activityid, count, duration]);
        
        return routine_activity; 
    }catch (error){
        console.log("error in addActivityToRoutine")
    }
}

async function attachActivitiesToRoutines(routines) {
    // no side effects
    const routinesToReturn = [...routines];
    const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
    const routineIds = routines.map(routine => routine.id);
    if (!routineIds?.length) return [];
    
    try {
      // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
      const { rows: activities } = await client.query(`
        SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
        FROM activities 
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId" IN (${ binds });
      `, routineIds);
  
      // loop over the routines
      for(const routine of routinesToReturn) {
        // filter the activities to only include those that have this routineId
        const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
        // attach the activities to each single routine
        routine.activities = activitiesToAdd;
      }
      return routinesToReturn;
    } catch (error) {
      throw error;
    }
  }

async function updateRoutineActivity({ id, count, duration }){
    try {
        const { rows } = await client.query(`
        UPDATE routineactivities
        SET count=$1,
            duration=$2
        WHERE id=${id}
        RETURNING *;
        `, [count, duration])
        return rows
    } catch (error) {
        console.log(error)
    }
}


async function destroyRoutineActivity(id) {
    try {
        const result = await client.query(`
        DELETE FROM routineactivities
        WHERE id = ${id}
        `);
        return result;
    } catch (error) {
        console.log ("Error in destroying routine activity")
        throw error;
    }
}

async function getRoutineActivityByRoutine({ id }) {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM routineactivities
        WHERE "routineid"=${id};
        `,);

        return rows;
    } catch (error) {
        console.log ("Error in getting routine activities by routine")
        throw error;
    }
}

module.exports = {
    getRoutineActivityById,
    addActivityToRoutine,
    updateRoutineActivity,
    destroyRoutineActivity,
    getRoutineActivityByRoutine,
    attachActivitiesToRoutines
}
