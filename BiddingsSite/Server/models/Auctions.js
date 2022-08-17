module.exports = (sequelize, DataTypes) => {
    const Auctions = sequelize.define("Auctions", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Currently: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Buy_Price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        First_Bid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Number_of_Bids: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Active:{
            type: DataTypes.INTEGER,
        },
        Started: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Ends: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Seller: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
    Auctions.associate = (models) => {
        Auctions.hasMany(models.Categories, {
            onDelete: "cascade",
        })
        Auctions.hasMany(models.Bids, {
            onDelete: "cascade",
        })
        Auctions.hasMany(models.Files, {
            onDelete: "cascade",
        })
        Auctions.hasOne(models.Location, {
            onDelete: "cascade",
        })

    }
    return Auctions;
}