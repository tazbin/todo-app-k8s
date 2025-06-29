const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

const Todo = sequelize.define('todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'todos'
});

module.exports = Todo;