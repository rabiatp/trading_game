const UserModel = require('../logicModels/user');
const InsertModel = require('../logicModels/insertModel');
const { Op } = require('sequelize');

let userLogic = {
    userInsert: function(insertData,thenFunc, errFunc){
       
        let userDetail = new InsertModel();
        userDetail.table = 't_user';
        userDetail.object= insertData;
        userDetail.err = function(err){
            return errFunc(err)
        },
        userDetail.then = function(data){
            let portfolio ={};
            portfolio.userId = data.id;
            portfolio.date = new Date();

            let portfolioDetail = new InsertModel();
            portfolioDetail.table = 't_portfolio';
            portfolioDetail.object= portfolio;
            portfolioDetail.err = function(err){
                return errFunc(err)
            },
            portfolioDetail.then = function(){
                return thenFunc('Your Data Has Been Saved Successfully');
            }
            return ormContanier.insert(portfolioDetail.table, portfolioDetail.object, portfolioDetail.then, portfolioDetail.err);
        }
        return ormContanier.insert(userDetail.table, userDetail.object, userDetail.then, userDetail.err)
    },
    getUserData :function(userId, thenFunc, errFunc){
        try {
            let jsonFilter = {
                [Op.and]: [
                    { id: { [Op.eq]: userId } },
                  ],
              };
            let getViewFilterQueryModel = {
                tableName: "v_user_portfolio",
                JSONFilter: jsonFilter,
            };
            let portfolioThenFunc = function(data){
                return thenFunc(data)
            }
            let portfolioErrFunc = function(){
                return errFunc('User not found')
            }
            return ormContanier.selectAndFilterByQuery(getViewFilterQueryModel, portfolioThenFunc, portfolioErrFunc)
        } catch (error) {
            return errFunc(error)
        }
    }  
}

module.exports = userLogic;