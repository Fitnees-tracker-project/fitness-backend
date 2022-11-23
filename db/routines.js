const { client } = require('./index')
const { getUserByUsername } = require('./users')

async function getRoutineById(id){
    // working
    try {
        const {rows: [user]} = await client.query(`
            SELECT id, name, goal
            FROM routines
            WHERE id=${id};
        `)
        return user
    } catch (error) {
        console.log(error)
    }
}

async function getAllRoutines() {
    try {
      const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id 
      `);
      return attachActivitiesToRoutines(routines);
    } catch (error) {
      throw error
    }
  }

async function getAllRoutinesByUser(creatorId) {
    // WORKING
    try {
       const  {rows}  = await client.query(`
        SELECT name, goal
        FROM routines
        WHERE creatorid=${creatorId}
       `,)
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getPublicRoutinesByUser(creatorId) {
    //WORKING
    try {
        const {rows} = await client.query(`
            SELECT name, goal
            FROM routines
            WHERE creatorid=${creatorId} AND ispublic=true;
        `)
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getAllPublicRoutines() {
    //WORKING
    try {
        const {rows} = await client.query(`
            SELECT *
            FROM routines
            WHERE ispublic=true;
        `)
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function getPublicRoutinesByActivity({id}) {
    // COME BACK AFTER ACTIVITYS ARE DONE
    // NEEDS JOINED ROUTINE ACTS
    // MAY HAVE TO SKIP
    try {
        const {rows } = await client.query(`
        SELECT *
        FROM routines
        WHERE activityid=${id}
        `)
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function createRoutine({creatorId, isPublic, name, goal}) {
    // WORKING
    try {
        const result = await client.query(`
            INSERT INTO routines (creatorId, isPublic, name, goal)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [creatorId, isPublic, name, goal])
        return result
    } catch (error) {
        console.log(error)
    }
}

async function updateRoutine({id, isPublic, name, goal }) {
  // WORKS
    try {
        const result = await client.query(`
           UPDATE routines
           SET isPublic=$1,
                name=$2,
                goal=$3
           WHERE id=${id}
           RETURNING *;
        `, [isPublic, name, goal])
        return result
    } catch (error) {
        console.error(error.detail)
    }
}

async function destroyRoutine(id) {
    // WORKING
try {
    const result = await client.query(`
        DELETE FROM routines
        WHERE id=${ id }
    `)
} catch (error) {
    console.log(error)
}
}


module.exports = {
    createRoutine,
    getRoutineById,
    getAllRoutines,
    getAllRoutinesByUser,
    getAllPublicRoutines,
    destroyRoutine,
    getPublicRoutinesByUser,
    updateRoutine,
    getPublicRoutinesByActivity
}