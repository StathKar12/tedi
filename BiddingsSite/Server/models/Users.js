module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        
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