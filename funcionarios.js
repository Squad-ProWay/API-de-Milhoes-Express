const express = require('express')
const app = express()
var cors = require('cors')

var dados = require('./dbservico')

/**Middleware para utilizar urlencoded */
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

/**middleware cors*/
app.use(cors());

app.get('/funcionarios', (req, res) => {
    res.status(200).send(dados)
})

app.post('/funcionarios', (req, res) => {
    let ob = {
        id: dados.length + 1,
        nome: req.body.nome,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        servico: req.body.servico,
        descricao: req.body.descricao
    }
    dados.push(ob)
    res.status(201).send(ob)
})

app.put('/funcionarios/:idfuncionario', (req, res) => {
    let idfuncionario = req.params.idfuncionario;
    let funcionarioAlterado = {}
    for (let func of dados) {
        if (func.id == idfuncionario) {
            func.nome = req.body.nome
            func.telefone = req.body.telefone
            func.cpf = req.body.cpf
            func.servico = req.body.servico
            func.descricao = req.body.descricao
            funcionarioAlterado = func
        }
    }
    res.status(200).send(funcionarioAlterado)
})

app.get('/funcionarios/:idfuncionario', (req, res) => {
    let idfuncionario = req.params.idfuncionario
    let funcionarioRetornado = {}
    for (let func of dados) {
        if (func.id == idfuncionario) {
            funcionarioRetornado = func;
            break;
        }
    }
    res.status(200).send(funcionarioRetornado)
})



app.listen(8081, () => console.log('Aplicação em execução na url http://localhost:8081'))