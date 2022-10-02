module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define("History", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    });

   return History;
}