'use strict';

const fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.User = require('./user')(sequelize, Sequelize);
db.Footage = require('./footage')(sequelize, Sequelize);
//https://ooeunz.tistory.com/71 >> 참고한 블로그
db.User.hasMany(db.Footage, {foreignKey: 'uid', sourceKey:'uid'});
db.Footage.belongsTo(db.User, {foreignKey : 'uid', sourceKey:'uid'});



db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
