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
    image: {
      type: Sequelize.BLOB,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'images'
    // options
  });

  return Images
}

module.exports = userSync;