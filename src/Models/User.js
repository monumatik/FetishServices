var userSync = (Sequelize, sequelize)=>{
 
  const Model = Sequelize.Model;

  class User extends Model {}
  User.init({
    id:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      len: [6,20]
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      len: [6,20]
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        len: [6,20]
      }
      // allowNull defaults to true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      len: [6,20]
      // allowNull defaults to true
    },
    sex: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [['m', 'w']],
        len: 1
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