module.exports = (sequelize, DataTypes) => {
    return  sequelize.define('t_portfolio', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        autoIncrement: true,
        primaryKey: true,
        field: 'id'
      },
      userId: {
			  type: DataTypes.INTEGER,
        allowNull : false,
        references: { 
          model: 'tUser', 
          key: 'id' 
			  },
			  field: 'user_id'
		  },
      shareId: {
			  type: DataTypes.INTEGER,
        allowNull: true,
        references: { 
          model: 't_share', 
          key: 'id' 
			  },
			  field: 'share_id'
		  },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'quantity'
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'price'
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'date'
      },
      // BUY TYPE 1, SELL TYPE 2 
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'type'
      },
    }, {
        tableName: 't_portfolio'
    });
};