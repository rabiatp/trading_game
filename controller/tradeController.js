let app;
let constants = require('../constants/constants');
let tradeLogic = require('../logic/tradeLogic');
let Enums = require('../logicModels/Enums');
let HttpStatus = constants.HttpStatus;

module.exports = function(application) {
    app = application;

    // Create and Save a share
    app.post("/createShares", async function (req,res){
        const share = req.body;
        return  tradeLogic.shareInsert(share, function(data){
            return res.status(HttpStatus.OK).json(data);
        }, function(err){
            return res.status(HttpStatus.BAD_REQUEST).json('shares could not be registered');
        })
    })
    // share info view 
    app.get('/getShare/:id', async function(req, res) {
        let shareId = parseInt(req.params.id);
        return tradeLogic.getShares(shareId, function (data) {
            return res.status(HttpStatus.OK).json(data);
        }, function(err){
            return res.status(HttpStatus.BAD_REQUEST).json(err);
        })
    })
    // sharesa ait fiyat güncellemsi yapıyor 
    app.post('/updateSharePrice/:id', async function(req,res){
        let shareId = parseInt(req.params.id);
        let shareHolding = req.body;
        let shareHoldingData= {
            shareId: shareId,
            date: shareHolding.date,
            price: shareHolding.price
        }
        return tradeLogic.updateSharePrice(shareHoldingData, function(data){
            return res.status(HttpStatus.OK).json(data);
        }, function(err){
            return res.status(HttpStatus.BAD_REQUEST).json('share holding could not be registered');
        })
    })
    //view user information
    app.get("/getShares/:id", async function(req,res){
        let sharesId = parseInt(req.params.id); 

        return tradeLogic.getShares(sharesId, function(data){
            return res.status(HttpStatus.OK).json(data);
        }, function(err){
            return res.status(HttpStatus.BAD_REQUEST).json(err);
        })
    })
    
    app.post("/buyyOrShare/:user_id", async function(req,res) {
        let transactionType =  req.body.transactionType
        transactionType = transactionType.toUpperCase();
        let transactionValue = {
            userId: parseInt(req.params.user_id),
            symbol: req.body.symbol,
            quantity: req.body.quantity,
            type : Enums.salesTransaction[transactionType]
        }
        
        if(transactionType == 'BUYY'){
            return tradeLogic.buyyShares(transactionValue, function(data){
                return res.status(HttpStatus.OK).json(data);
            }, function(err){
                return res.status(HttpStatus.BAD_REQUEST).json('shares could not be registered');
            })
        }
        return tradeLogic.sellShares(transactionValue, function(data){
            return res.status(HttpStatus.OK).json(data);
        }, function(err){
            return res.status(HttpStatus.BAD_REQUEST).json('shares could not be registered');
        })
       
    })
    app.post("sell/:id", async function(req,res) {

    })
}