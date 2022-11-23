function requireUser(req, res, next){
    if(!req.user){
        next({
            name: "MissingUserError",
            message: "You must be logged in to complete this task!"
        })
    }
    next()
}

module.exports = {
    requireUser
}