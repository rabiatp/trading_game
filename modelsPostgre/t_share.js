module.exports = function(sequelize, DataTypes){
    return sequelize.define('t_share', {
        id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			autoIncrement: true,
			primaryKey: true,
			field: 'id'
		},
        name: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'name'
		},
        symbol: {
			type: DataTypes.STRING(3),
			allowNull: true,
			field: 'symbol'
		},
        shareRate: {
			type: DataTypes.DECIMAL(10,2),
			allowNull: true,
            defaultValue: 2,
            field: 'share_rate'
		},
		//The date the share was recorded.
        date: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'date'
		},
    },{
		tableName: 't_share'
	})
}