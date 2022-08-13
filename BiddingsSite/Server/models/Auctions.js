module.exports = (sequelize, DataTypes) => {
    const Auctions = sequelize.define("Auctions", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Currently: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Buy_Price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        First_Bid: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Number_of_Bids: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Bids: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    Auctions.associate = (models) => {
        Auctions.hasMany(models.Categories, {
            onDelete: "cascade",
        })
    }
    return Auctions;
}