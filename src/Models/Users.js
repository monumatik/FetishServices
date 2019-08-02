var userSync = (Sequelize, sequelize)=>{
 
  const Model = Sequelize.Model;

  class Users extends Model {}
  Users.init({
    id:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [1,40]
      }
      // allowNull defaults to true
    },
     login: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1,20]
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [6,32]
      }
      // allowNull defaults to true
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    hooks: {
      afterValidate: (users, options)=>{
        const sugar = require('../sugar')
        const md5 = require('md5')
        users.password = md5(`${users.password}${sugar.activationLinkSugar}`)
      }
    },
    modelName: Users.name
    // options
  });

  return Users
}

module.exports = userSync;