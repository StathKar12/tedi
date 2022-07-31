module.exports = (sequelize, DataTypes) => {
    const Auctions = sequelize.define("Auctions", {
        ItemID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    });

    const Auc_Cat = sequelize.define("Auc_Cat", {
        AuctionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        CategoryID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    });

    return Auctions,Auc_Cat;
}