module.exports = (sequelize, DataTypes) => {
    const Auctions = sequelize.define("Auctions", {
        
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    });

    return Auctions;
}