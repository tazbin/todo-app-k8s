const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Todos'
});

module.exports = Todo;