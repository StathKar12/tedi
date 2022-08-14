module.exports = (sequelize, DataTypes) => {
    const Files = sequelize.define("Files", {
        
        FileName: {
            type: DataTypes.STRING,
            allowNull: false,
        }        
    });

   return Files;
}