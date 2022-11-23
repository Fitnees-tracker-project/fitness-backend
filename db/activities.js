const {client} = require("./index")

async function getAllActivities() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM activities;
`);
        return rows;
    } catch (error) {
        console.log("Error on getting activities")
        throw error;
    }
}

async function getActivityById(activityId) {
    try{
        const { rows: [activity] } = await client.query(`
        SELECT *
        FROM activities 
        WHERE id=$1
        `, [activityId]);

        return activity;
    } catch (error){
        console.log("Error on getting activity by Id")
        throw error;
    }
}

async function createActivity({ name, description }) {
    try {
        const { rows: [activity] } = await client.query(`
        INSERT INTO activities (name, description)
        VALUES($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
        `, [name, description]);

        return activity; 
    } catch (error) {
        console.log("Error creating activity")
        throw error;
    }
}

async function updateActivity ({ id, name, description }) {
    try{
        const result = await client.query(`
        UPDATE activities
        SET name=$1,
            description=$2
        WHERE id=${id}
        RETURNING *;
        `, [name, description])
    return result 
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getAllActivities,
    getActivityById,
    createActivity, 
    updateActivity 
}