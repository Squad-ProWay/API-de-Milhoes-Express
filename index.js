const express = require('express')
const app = express()
const port = 8081

var rotasServico = require('./servico')


//Invoca o Middleware

app.use('/servicos', rotasServico)

app.listen(port, () => console.log('Aplicação em execução na url http://localhost:8081'))