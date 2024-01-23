const ShareModel = require('../logicModels/share');
const PriceHistoryModel = require('../logicModels/priceHistory');
const InsertModel = require('../logicModels/insertModel');
const userLogic = require('./userLogic');
const { Op } = require('sequelize');


let tradeLogic = {
    /**
     * Handles bulk insertion of multiple share records, considering the possibility of making multiple share entries.
     * @param {Array} shareInsertData - An array containing share data for multiple entries.
     * @param {Function} thenFunc - Callback function to handle successful execution.
     * @param {Function} errFunc - Callback function to handle errors.
     * @returns {Array}
     */

    shareInsert : function(shareInsertData, thenFunc, errFunc){
        let shareData = [], uniqShareHolding = [];
        for (let i = 0; i < shareInsertData.length; i++) {
            let shareInsertObj = new ShareModel();
            shareInsertObj.name = shareInsertData[i].name
            if(shareInsertData[i].symbol.lenght >= 3){
                return errFunc('The symbol must be at most 3 characters')
            }
            shareInsertObj.symbol = shareInsertData[i].symbol
            
            if ((shareInsertData[i].shareRate.toString().split('.')[1] || '').length > 2) {
                return errFunc('Share rate must have 2 decimal places')
            }
            shareInsertObj.shareRate = shareInsertData[i].shareRate
            shareInsertObj.date = shareInsertData[i].date
            shareData.push(shareInsertObj);
            
            if(uniqShareHolding[shareInsertData[i].name + '_' + shareInsertData[i].symbol] == undefined ){
                uniqShareHolding[shareInsertData[i].name + '_' + shareInsertData[i].symbol] = [];
            }
            uniqShareHolding[shareInsertData[i].name + '_' + shareInsertData[i].symbol].push({
                price : shareInsertData[i].price,
                updatedDate :  shareInsertData[i].updatedDate
            })
        }
        let shareDetail = new InsertModel();
        shareDetail.table = 't_share'
        shareDetail.object = shareData;
        shareDetail.err = function(err){
            return errFunc(err);
        }
        shareDetail.then = function(getShareData){
            let priceHistoryData = []
            for (let i = 0; i < getShareData.length; i++) {
                let shareObjData = {};
                if(uniqShareHolding[getShareData[i].name + '_' + getShareData[i].symbol] != undefined){
                    shareObjData = uniqShareHolding[getShareData[i].name + '_' + getShareData[i].symbol];
                }
                let priceHistoryObj = new PriceHistoryModel();
                priceHistoryObj.shareId = getShareData[i].id
                priceHistoryObj.price = shareObjData[0].price,
                priceHistoryObj.date = shareObjData[0].updatedDate;
                priceHistoryData.push(priceHistoryObj);
            }
            let priceHistoryDetail = new InsertModel();
            priceHistoryDetail.table = 't_price_history'
            priceHistoryDetail.object = priceHistoryData;
            priceHistoryDetail.err = function(err){
                return errFunc(err);
            }
            priceHistoryDetail.then = function(data){
                return thenFunc('Your Data Has Been Saved Successfully')
            }
            return ormContanier.bulkInsert(  priceHistoryDetail.table, priceHistoryDetail.object, priceHistoryDetail.then, priceHistoryDetail.err)
        }
        return ormContanier.bulkInsert( shareDetail.table, shareDetail.object,  shareDetail.then, shareDetail.err );
        
    },
    shareHoldingInsert : function(shareHoldingObj, thenFunc, errFunc){
        let shareHoldingDetail = new InsertModel();
        shareHoldingDetail.table = 't_share_holding'
        shareHoldingDetail.object = shareHoldingObj;
        shareHoldingDetail.err = function(err){
            return errFunc(err);
        }
        shareHoldingDetail.then = function(data){
            return thenFunc('Your Data Has Been Saved Successfully') 
        }
        return ormContanier.insert(shareHoldingDetail.table, shareHoldingDetail.object, shareHoldingDetail.then, shareHoldingDetail.err)
    },
    
   /**
     * Retrieves share information grouped by share ID using the v_share view.
     *
     * @param {number} shareId - The ID of the share.
     * @param {Function} thenFunc - The callback function to handle successful execution.
     * @param {Function} errFunc - The callback function to handle errors.
     * @returns {Object} - Share information object.
     */

    getShares : function (shareId, thenFunc, errFunc) {
        let jsonFilter = { [Op.and]: [{ id: { [Op.eq]: shareId } }]};
        let getViewFilterQueryModel = {
            tableName: "v_share",
            JSONFilter: jsonFilter,
        };
        let shareThenFunc = function(data){
            return thenFunc(data);
        }
        let sharePricErrFunc = function(error){
            return errFunc(error);
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, shareThenFunc, sharePricErrFunc)
    },
    
    getHoldingInfo : function (holdingId, thenFunc, errFunc){
        let jsonFilter = { [Op.and]: [{ id: { [Op.eq]: holdingId } }]};
        let getViewFilterQueryModel = {
            tableName: "v_holding",
            JSONFilter: jsonFilter,
        };
        let holdingThenFunc = function(data){
            return thenFunc(data);
        }
        let holdingPricErrFunc = function(error){
            return errFunc(error);
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, holdingThenFunc, holdingPricErrFunc)
    },
    sharesController : function(shareSymbol, thenFunc, errFunc ){
        return sequelizeModels.tableName['t_share'].findAll({where: {symbol : shareSymbol}})
            .then((shareData) => {
                if(shareData || shareData.length != 0){
                    return thenFunc(shareData)
                }
                return thenFunc(false)
            })
            .catch((err) => {
                return errFunc(err)
            })
    },
    //BUYY
    /**
     * Retrieves share data based on the most recent update of share prices in the v_share view for the desired purchase price.
     * For buying, first, it is checked whether there is information for that share or not.
     * It should be checked if there is an adequate quantity of shares, and if the quantity of shares is less than the amount to be bought, an error should be thrown.
     * The first purchase creates shares holding, and we need to check this.
     * In the portfolio, the user will update the quantity and price of the shares.
     * In shares holding, the purchased quantity is added on top of the total sold quantity.
     * Available shares are updated.
     *
     * @param {Object} buyyData - Data for the buy operation.
     * @param {Function} thenFunc - Callback function to handle successful execution.
     * @param {Function} errFunc - Callback function to handle errors.
     * @returns {String} - Success or error message.
     * @throws {Error} - Throws an error if certain conditions are not met.
     */

    buyyShares : function(buyyData, thenFunc, errFunc){
        let shareControllerThenFunc = (shareController) => {
            if(!shareController){
                return errFunc('There is no such share')
            }
            
            // Searching for a specific symbol
            let jsonFilter = { [Op.and]: [{ id: { [Op.eq]: shareController[0].dataValues.id } }]};
            let getViewFilterQueryModel = {
                tableName: "v_share",
                JSONFilter: jsonFilter, 
            };
            let shareThenFunc = function(data){
              
                if(data[0].share_holding_id != null && (data[0].available_shares < buyyData.quantity)){
                    return errFunc(`The quantity of shares to be purchased exceeds the current quantity of shares. The current quantity of shares is ${data[0].available_shares}`)
                }
                return userLogic.getUserData(buyyData.userId, function(userData){
                    
                    let totalQuantity = userData[0].quantity + buyyData.quantity;
                    let userInfoUpdateObj = {
                        quantity : totalQuantity,
                        price : userData[0].price + (buyyData.quantity * data[0].price),
                        shareId : data[0].id,
                        type : buyyData.type
                    }
                   
                    let shareHoldingeObjUpdate = {
                        totalSharesBought: buyyData.quantity,
                        
                    }

                    let shareHoldingObjCreate = {
                        shareId : data[0].id,
                        totalSharesBought: buyyData.quantity,
                        totalSharesSold : 0,
                        availableShares: data[0].share_rate - buyyData.quantity
                    }
    
                 // Update user's share quantity and price in the portfolio
                    sequelize.transaction().then(t => {
                        return sequelizeModels.tableName['t_portfolio'].update(userInfoUpdateObj, { 
                            where: {
                            user_id:buyyData.userId
                          }})
                            .then((portfolioData) => {
                                return sequelizeModels.tableName['t_share_holding'].findOne({where: {share_id : data[0].id}})
                                .then((holdingData) => {
                                    // If holding data is empty, it will create, otherwise, it will update
                                    if(holdingData != null ){
                                        // It adds to the quantity of previously purchased shares
                                        shareHoldingeObjUpdate.totalSharesBought += holdingData.total_shares_bought
                                        // Determines the available quantity of shares
                                        shareHoldingeObjUpdate.availableShares =  data[0].share_rate - ( shareHoldingeObjUpdate.totalSharesBought + shareHoldingeObjUpdate.totalSharesSold)
                                        return sequelizeModels.tableName['t_share_holding'].update(shareHoldingeObjUpdate, { 
                                            where: {
                                            share_id : data[0].id
                                          }})
                                          .then((shareHoldingData) => {
                                            return thenFunc(shareHoldingData)
                                          })
                                    }
                                    let shareHoldingFunc = (shareHoldingData) =>{
                                        return thenFunc(shareHoldingData)
                                    }
                                    return tradeLogic.shareHoldingInsert(shareHoldingObjCreate,  shareHoldingFunc, errFunc );
                                })
                               
                            })
                            .catch((error) => {
                                return errFunc(error);
                            });
                    });
                }, function(errData){
                    return errfFunc(errData);
                })
            }
            return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, shareThenFunc, errFunc);

        }
        return tradeLogic.sharesController(buyyData.symbol, shareControllerThenFunc, errFunc)
    },
    //SELL
    sellShares : function(sellData, thenFunc, errFunc){
        let shareControllerThenFunc = (shareController) => { 
            if(!shareController){
                return errFunc('There is no such share')
            }
            let jsonFilter = { [Op.and]: [{ id: { [Op.eq]: shareController[0].dataValues.id } }]};
            let getViewFilterQueryModel = {
                tableName: "v_share",
                JSONFilter: jsonFilter, // Belirli bir sembolü arıyoruz
            };
            let shareThenFunc = function(data){
                
                // Checking sufficiency of the quantity of shares for sale.
                if (data[0].share_holding_id != null && data[0].available_shares < sellData.quantity) {
                    return errFunc(`The quantity of shares to be sold exceeds the current quantity of shares. The current quantity of shares is ${data[0].available_shares}`);
                }
                
                return userLogic.getUserData(sellData.userId, function(userData){
                  
                    let totalQuantity = userData[0].quantity - sellData.quantity;
                    let userInfoUpdateObj = {
                        quantity : totalQuantity,
                        price :  userData[0].price - (sellData.quantity * data[0].price),
                        shareId : data[0].id,
                        type : sellData.type
                    }
    
                    let shareHoldingeObjUpdate = {
                        totalSharesSold: sellData.quantity,
                    }
    
                    let shareHoldingObjCreate = {
                        shareId : data[0].id,
                        totalSharesBought: sellData.quantity,
                        totalSharesSold : 0,
                        availableShares: data[0].share_rate + sellData.quantity
                    }
    
                    // Update user's share quantity and price in the portfolio
                    sequelize.transaction().then(t => {
                        return sequelizeModels.tableName['t_portfolio'].update(userInfoUpdateObj, { 
                            where: {
                            user_id:sellData.userId
                          }})
                            .then((portfolioData) => {
                                return sequelizeModels.tableName['t_share_holding'].findOne({where: {share_id : data[0].id}})
                                .then((holdingData) => {
                                    if(holdingData != null ){
    
                                        shareHoldingeObjUpdate.totalSharesSold += holdingData.total_shares_sold
                                        shareHoldingeObjUpdate.availableShares =  data[0].share_rate - (shareHoldingeObjUpdate.totalSharesSold + shareHoldingeObjUpdate.totalSharesBought)
                                        return sequelizeModels.tableName['t_share_holding'].update(shareHoldingeObjUpdate, { 
                                            where: {
                                            share_id : data[0].id
                                          }})
                                          .then((shareHoldingData) => {
                                            return thenFunc(shareHoldingData)
                                          })
                                    }
                                    let shareHoldingFunc = (shareHoldingData) =>{
                                        return thenFunc(shareHoldingData)
                                    }
                                    return tradeLogic.shareHoldingInsert(shareHoldingObjCreate,  shareHoldingFunc, errFunc );
                                })
                               
                            })
                            .catch((error) => {
                                return errFunc(error);
                            });
                    });
                }, errFunc)
            }
           
            return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, shareThenFunc, errFunc);
        }
        return tradeLogic.sharesController(sellData.symbol, shareControllerThenFunc, errFunc)
    },
   /**
     * Updates the share price for a specific share in the database.
     * This function is used to modify the share rate of an existing share.
     *
     * @param {Object} share - The data containing the updated share rate information.
     * @param {Function} thenFunc - The callback function to handle successful execution.
     * @param {Function} errFunc - The callback function to handle errors.
     * @returns {object} - Returns a string indicating the result of the operation.
     */
    updateSharePrice : function(share, thenFunc, errFunc){
        let jsonFilter = { [Op.and]: [{ share_id: { [Op.eq]: share.shareId } }]}
        let getViewFilterQueryModel = {
            tableName: "t_price_history",
            JSONFilter: jsonFilter,
        };
        let sharePriceThenFunc = function (priceHistoryData) {
            if (priceHistoryData && priceHistoryData.length > 0) {
                let priceHistoryRecord = {
                    date: share.date,
                    price:share.price
                }
                return sequelizeModels.tableName['t_price_history'].update(priceHistoryRecord,{
                    where: {
                        share_id : priceHistoryData[0].share_id
                      }})
                      .then(updatedRecord => {
                                thenFunc(updatedRecord);
                            })
                            .catch(error => {
                                errFunc(error);
                            });

            } else {
                errFunc('Your Data Could Not Be Found');
            }
        }
        let sharePriceErrFunc = function (error){
            return errFunc(error)
        }
        return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, sharePriceThenFunc, sharePriceErrFunc)
    },
   

}
module.exports = tradeLogic;