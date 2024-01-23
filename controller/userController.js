let app;
let constants = require('../constants/constants');
const userLogic = require('../logic/userLogic');
let HttpStatus = constants.HttpStatus;

module.exports = function(application) {
    app = application;

    // Create and Save a new user
    app.post("/create", async function (req,res){
        const user = {
            name: req.body.name,
            surname : req.body.surname
          };
        return  userLogic.userInsert(user, function(data){
            return res.status(HttpStatus.OK).json(data);
        }, function(err){
            return res.status(HttpStatus.BAD_REQUEST).json('user could not be registered');
        })
    })

    //view user information
    app.get("/getUser/:id", async function(req,res){
        let userId = parseInt(req.params.id); 

        return userLogic.getUserData(userId, function(data){
            return res.status(HttpStatus.OK).json(data);
        }, function(err){
            return res.status(HttpStatus.BAD_REQUEST).json(err);
        })
    })
}