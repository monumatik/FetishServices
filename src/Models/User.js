var userSync = (Sequelize, sequelize)=>{
 
  const Model = Sequelize.Model;

  class User extends Model {}
  User.init({
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
        len: [6,20]
      }
      // allowNull defaults to true
    },
    sex: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [['m', 'w']]
      }
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'user'
    // options
  });

  return User
}

module.exports = userSync;