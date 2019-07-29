class Database {
  constructor(){
    this.Sequelize = require('sequelize');
    this.sequelize = new this.Sequelize('Fetish', 'postgres', 'dupadupa', {
      host: 'localhost',
      dialect: 'postgres',
      schema: 'g' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    });

    const User = require('./Models/User.js')
    this.UserClass = User(this.Sequelize, this.sequelize)
    const Images = require('./Models/Images.js')
    this.ImagesClass = Images(this.Sequelize, this.sequelize)
  }

  syncDatabase(){
    this.sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');

      this.UserClass.hasMany(this.ImagesClass, {
        as: 'userId'
      })
      this.UserClass.belongsTo(this.ImagesClass, {
        as: 'Current',
        foreignKey: {
          name: 'profileImageId',
          allowNull: true
        },
        constraints: false
      })

      this.sequelize.sync({force:true}).then(()=>{
        /*this.UserClass.create({
          login: 'John',
          email: 'chuj12@wp.pl',
          password: 'asdsdjyhqwioeuyqoih',
          sex: 'm',
          profileImageId: 1
        });

        this.ImagesClass.create({
          image: '/9j/4AAQSkZJRgABAQAAAQABAAD//',
          userId: 1
        });
        */
      })
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
      }
    )
  }
}

module.exports = Database;