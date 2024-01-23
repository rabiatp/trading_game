module.exports = function(sequelize, DataTypes){
    return sequelize.define('t_share_holding', {
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
				model: 'tShare', 
				key: 'id' 
			},
			field: 'share_id'
		},
        totalSharesBought: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'total_shares_bought'
		},
        totalSharesSold: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'total_shares_sold'
		},
        availableShares: {
			type: DataTypes.FLOAT,
			allowNull: true,
			field: 'available_shares'
		},
    },{
        tableName: 't_share_holding'
    })
}