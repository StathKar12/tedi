const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Rating:{
            type: DataTypes.INTEGER,
            allowNull:true,
        }
        
    });
    Users.associate = (models) => {
        Users.hasMany(models.Auctions, {
            onDelete: "cascade",
        })
        Users.hasMany(models.Bids, {
            onDelete: "cascade",
        })
        Users.hasOne(models.Location, {
            onDelete: "cascade",
        })
    }
    return Users;
}