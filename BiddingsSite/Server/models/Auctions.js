module.exports = (sequelize, DataTypes) => {
    const Auctions = sequelize.define("Auctions", {
        
        Title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
    });

    return Auctions;
}