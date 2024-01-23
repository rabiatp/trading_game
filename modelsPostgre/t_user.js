module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tUser', {
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
        surname: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'surname'
		}
		
	}, {
		tableName: 't_user'
	});
}