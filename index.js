const express = require('express')
const app = express()
const port = 8081

var rotasServico = require('./servico')
var rotasFuncionario = require('./funcionario')
var rotasHorarios = require('./horarioCliente')

//Invoca o Middleware

app.use('/servicos', rotasServico)
app.use('/horarios', rotasHorarios)
app.use('/funcionarios', rotasFuncionario)

app.listen(port, () => console.log('Aplicação em execução na url http://localhost:8081'))