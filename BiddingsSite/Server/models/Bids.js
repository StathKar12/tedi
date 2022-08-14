module.exports = (sequelize, DataTypes) => {
    const Bids = sequelize.define("Bids", {
        BidderID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },        
        Time: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }        
    });

   return Bids;
}


//Add ratings to user table