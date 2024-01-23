const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());5
app.use(cors());
app.use(express.json());

global.sequelizeModels = {};

let ormContanierModel = require('./helpers/ormContanier');
global.ormContanier = ormContanierModel.ormContainer
global.sequelize = ormContanierModel.connection();




require('./controller/userController')(app);
require('./controller/tradeController')(app);


app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor.`);
});





