module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define("Location", {
        Country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Location: {
            type: DataTypes.STRING,
            allowNull: false,
        },   
        Longtitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        }, 
        Latitude: {
            type: DataTypes.FLOAT,
            allowNull: true,
        }       
    });

   return Location;
}