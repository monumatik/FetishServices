var userSync = (Sequelize, sequelize)=>{
 
  const Model = Sequelize.Model;

  class Images extends Model {}
  Images.init({
    id:{
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    url: {
      type: Sequelize.TEXT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: Images.name
    // options
  });

  return Images
}

module.exports = userSync;