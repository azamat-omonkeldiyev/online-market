const {db , DataTypes} = require("../config/db");
const Region = require("./region.model");

const User = db.define(
    "user",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        phone: {
            type: DataTypes.STRING,
            allowNull:false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false
        },

        region_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        image: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.ENUM("seller","user","admin","superadmin"),
            allowNull: false
        }
    },
);

Region.hasMany(User, { foreignKey: 'region_id', onDelete: 'CASCADE' });
User.belongsTo(Region, { foreignKey: 'region_id'});

module.exports = User;