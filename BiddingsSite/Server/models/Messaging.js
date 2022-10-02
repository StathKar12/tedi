
module.exports = (sequelize, DataTypes) => {
    const Messaging = sequelize.define("Messaging", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        Message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Send_To: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Time_Send: {
            type: DataTypes.STRING,
            allowNull: false
        },
        VtoA: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        VtoR: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });
    
    
    return Messaging;
}