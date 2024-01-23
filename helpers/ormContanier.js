function connection(){
    const { Sequelize, DataTypes } = require('sequelize');
    const dbConfig = require("../config/db.config"); 

    const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
      
        pool: {
          max: dbConfig.pool.max,
          min: dbConfig.pool.min,
          acquire: dbConfig.pool.acquire,
          idle: dbConfig.pool.idle
        },
        define: {
            timestamps: false
          },
          options: {
            encrypt: false,
            trustServerCertificate: true,
          }
    });
    
    sequelize.authenticate()
      .then(() => {
        sequelizeModels.tableName = {
            't_user' : require('../modelsPostgre/t_user')(sequelize, DataTypes),
            't_share' : require('../modelsPostgre/t_share')(sequelize, DataTypes),
            't_portfolio' : require('../modelsPostgre/t_portfolio')(sequelize, DataTypes),
            't_share_holding' : require('../modelsPostgre/t_share_holding')(sequelize, DataTypes),
            't_price_history' : require('../modelsPostgre/t_price_history')(sequelize, DataTypes)
        }
       
      })
      .catch((err) => {
        console.error('Veritabanı senkronizasyonu başarısız:', err.message);
      });

    return sequelize;
}

const { Op } = require('sequelize'); 

let ormContainer = {

    insert: function(tableName, object, thenFunc, errFunc) {
       
        sequelize.transaction().then(t => {
            return sequelizeModels.tableName[tableName].create(object, { transaction: t })
                .then((data) => {
                     t.commit();
                    return thenFunc(data.dataValues);
                })
                .catch((error) => {
                    t.rollback();
                    return errFunc(error);
                });
        });
    },
    bulkInsert: function(tableName, object, thenFunc, errFunc){
       
        sequelize.transaction().then(t => {
            return sequelizeModels.tableName[tableName].bulkCreate(object, { transaction: t })
                .then((data) => {
                    let returnData = [];
                    for (let i = 0; i < data.length; i++) {
                        returnData[i] = data[i].dataValues;
                    }
                     t.commit();
                    return thenFunc(returnData);
                })
                .catch((error) => {
                    t.rollback();
                    return errFunc(error);
                });
        });
    },
    selectAndFilterByQuery: async  function (getViewFilterQueryModel, thenFunc, errFunc) {
        try {
            const andSelectRows = getViewFilterQueryModel.JSONFilter[Op.and].map((condition) => {
                const column = Object.keys(condition)[0];
                let sqlOperator = '';
                let sqlValue = '';
            
                switch (Object.getOwnPropertySymbols(condition[column])[0]) {
                    case Op.eq:
                        sqlOperator = '=';
                        sqlValue = condition[column][Op.eq];
                        break;
                    case Op.in:
                        sqlOperator = 'IN';
                        sqlValue = condition[column][Op.in].join(', ');
                        break;
                    case Op.lte:
                        sqlOperator = '<=';
                        sqlValue = condition[column][Op.lte];
                        break;
                    case Op.gte:
                        sqlOperator = '>=';
                        sqlValue = condition[column][Op.gte];
                        break;
                    default:
                        // Bilinmeyen bir operatör varsa hata fırlatın veya varsayılan bir işlem yapın.
                        return errFunc(`Bilinmeyen operatör: ${Object.keys(condition[column])[0]}`);
                        
                }
            
                return `${column} ${sqlOperator} ${sqlValue}`;
              });
            
                const querySelect = `SELECT * FROM ${getViewFilterQueryModel.tableName}`;
                const queryWhere = andSelectRows.join(' AND '); // Koşulları AND ile birleştiriyoruz
                
                const sqlQuery= `${querySelect} WHERE ${queryWhere}`;
                returnData=  await sequelize.query(sqlQuery)
      
                if(thenFunc == undefined){
                  return returnData
                }
                return thenFunc(returnData[0])
        } catch (error) {
            return errFunc(error)
        }
      
    }      
};

module.exports = {ormContainer, connection};


