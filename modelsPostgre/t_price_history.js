//t_price_history ->  tarih bazlı fiyat değişikliklerini depolamak 
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('t_price_history', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        },
        shareId: {
            type: DataTypes.INTEGER,
            references: { 
                model: 't_share', 
                key: 'id' 
            },
            field: 'share_id'
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'price'
        },
        //The time when stocks are updated will be kept
        date: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'date'
        }
    }, {
        tableName: 't_price_history'
    });
};