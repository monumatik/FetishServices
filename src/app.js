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
    const Shows = require('./Models/Shows.js')
    Shows(this.Sequelize, this.sequelize)

  }

  syncDatabase(){
    this.sequelize
    .authenticate()
    .then(() => {


      this.sequelize.models.Users.hasMany(this.sequelize.models.Images, {
        as: 'Images'
      })

      this.sequelize.models.Users.belongsTo(this.sequelize.models.Users, {
        foreignKey: {
          name: 'profileImageId',
          allowNull: true
        },
        constraints: false
      })

      this.sequelize.models.Users.hasMany(this.sequelize.models.Shows, {
        as: "Shows",
        constraints: false
      })


      this.sequelize.sync({force:true})
      .then(async()=>{
        
        await this.sequelize.models.Users.create({
          login: 'zbok',
          email: 'luminousshadowpl@gmail.com',
          password: 'asdasdasd',
          profileImageId: 1,
          active: true
        });

        await this.sequelize.models.Users.create({
          login: 'pupek',
          email: 'patrykslu1@gmail.com',
          password: 'asdasdasd',
          profileImageId: 1,
          active: true
        });
        
        await this.sequelize.models.Images.create({
          image: '/9j/4AAQSkZJRgABAQAAAQABAAD//',
          UserId: 1,
          url: 'http://localhost:3001/Images/ruding.jpg'
        });

        await this.sequelize.models.Images.create({
          image: '/9j/4AAQSkZJRgABAQAAAQABAAD//',
          UserId: 2,
          url: 'http://localhost:3001/Images/ruding.jpg'
        });

        await this.sequelize.models.Images.create({
          image: '/9j/4AAQSkZJRgABAQAAAQABAAD//',
          UserId: 2,
          url: 'https://bit.ly/2ImnNHu'
        });

        await this.sequelize.models.Shows.create({
          UserId: 1,
          UserIdToShow: 2
        });

        await this.sequelize.models.Shows.create({
          UserId: 2,
          UserIdToShow: 1
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