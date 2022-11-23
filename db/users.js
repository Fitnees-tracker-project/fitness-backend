const { client } = require('./index');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

async function createUser( {username, password }) {
    const SALT_COUNT = 10;
    //EZ wokring
   try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    const result = await client.query(`
        INSERT INTO users ( username, password)
        VALUES($1, $2)
        RETURNING *;
    `, [username, hashedPassword])
   } catch (error) {
    console.log(error)
   }
}


async function getUser ({ username, password}){
    // WORKS
    try {
      const user = await getUserByUsername(username)

      const hashedPassword = user.password

      const passwordMatch = await bcrypt.compare(password, hashedPassword)

      if(passwordMatch){
        return user.username
      } else{
        console.log('Not a valid user!')
      }
    } catch (error) {
        console.log(error)
    }
}

async function getUserById(userId){
    //working
try {
    const user = await client.query(`
        SELECT id, username
        FROM users
        WHERE id=${ userId };
    `)
    return user
} catch (error) {
    console.log(error)
}
}

async function getUserByUsername(userName){
    //working
    const {rows: [user]} = await client.query(`
        SELECT username, password, id
        FROM users
        WHERE username=$1;
    `, [userName])
    return user
}

module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByUsername
}