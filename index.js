const express = require('express');
const { client } = require('./db/index')
const app = express();
const morgan = require('morgan');
require('dotenv').config() 
app.use(express.json());
app.use(morgan('dev'));

router.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    
    if (!auth) { // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
      
      try {
        const parsedToken = jwt.verify(token, JWT_SECRET);
        
        const id = parsedToken && parsedToken.id
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch (error) {
        next(error);
      }
    } else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
    }
  });


const apiRouter = require('./API/index')

app.use('/api', apiRouter)

client.connect();

app.listen(3000, () => {
    console.log('we are up and running on port 3000')
});