const {Sequelize, DataTypes} = require("sequelize");

const db = new Sequelize("home","root","1234",{
    host: "localhost",
    dialect: "mysql"
});

async function ConnectDb() {
    await db.authenticate();
    console.log("db connected");
    await db.sync({force: true});
    console.log("db synced");
};

module.exports = {ConnectDb, DataTypes, db}