var userSync = (Sequelize, sequelize)=>{
 
	const Model = Sequelize.Model;

  	class Shows extends Model {}
  	Shows.init({
    	UserIdToShow:{
     		type: Sequelize.INTEGER,
     		allowNull: false,
    	}
    },{
    	sequelize,
    	modelName: Shows.name
    });
    Shows.removeAttribute('id')

  return Shows
}

module.exports = userSync;