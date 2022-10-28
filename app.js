const express = require ('express');
const morgan = require('morgan');
const app = express();

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require ('./routes/pedidos');

app.use(morgan('dev'));

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)


module.exports= app;