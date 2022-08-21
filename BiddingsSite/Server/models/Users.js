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
            allowNull:false,
        },
        Active:{
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        AFM:{
            type: DataTypes.STRING,
            allowNull:false,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Phone:{
            type: DataTypes.STRING,
            allowNull:false,
        },

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