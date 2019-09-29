class Database {
  constructor(){
    this.Sequelize = require('sequelize');
    this.sequelize = new this.Sequelize('Fetish', 'postgres', 'dupadupa', {
      host: 'localhost',
      dialect: 'postgres',
      port: 5432,
      schema: 'g' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    });

    const Users = require('./Models/Users.js')
    Users(this.Sequelize, this.sequelize)
    const Images = require('./Models/Images.js')
    Images(this.Sequelize, this.sequelize)
  }

  syncDatabase(){
    this.sequelize
    .authenticate()
    .then(() => {
      this.sequelize.models.Users.hasMany(this.sequelize.models.Images, {
        as: 'userId'
      })
      this.sequelize.models.Users.belongsTo(this.sequelize.models.Users, {
        as: 'Current',
        foreignKey: {
          name: 'profileImageId',
          allowNull: true
        },
        constraints: false
      })

      this.sequelize.sync({force:true})
      .then(()=>{
        
        this.sequelize.models.Users.create({
          login: 'zbok',
          email: 'luminousshadowpl@gmail.com',
          password: 'asdasdasd',
          profileImageId: 1,
          active: true
        });
        
        this.sequelize.models.Images.create({
          image: '/9j/4AAQSkZJRgABAQAAAQABAAD//',
          userId: 1
        });
        
      })
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
      }
    )
  }
}

module.exports = Database;