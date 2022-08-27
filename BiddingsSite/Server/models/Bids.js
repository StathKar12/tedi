module.exports = (sequelize, DataTypes) => {
    const Bids = sequelize.define("Bids", {    
        Time: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }        
    });

   return Bids;
}
