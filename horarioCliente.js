const express = require('express')
const app = express()
var cors = require('cors')

var dados = require('./dbHorarioCliente')

/**Middleware para utilizar urlencoded */
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

/**middleware cors*/
app.use(cors());

app.get('/horarios', (req, res) => {
    res.status(200).send(dados)
})

app.post('/horarios', (req, res) => {
    let ob = {
        id: dados.length + 1,
        nome: req.body.nome,
        telefone: req.body.telefone,
        email: req.body.email,
        data: req.body.data,
        horario: req.body.horario,
        procedimento: req.body.procedimento,
        observacao: req.body.observacao
    }
    dados.push(ob)
    res.status(201).send(ob)
})

app.put('/horarios/:idhorario', (req, res) => {
    let idhorario = req.params.idhorario;
    let horarioAlterado = {}
    for (let hora of dados) {
        if (hora.id == idhorario) {
            hora.nome = req.body.nome
            hora.telefone = req.body.telefone
            hora.email = req.body.email
            hora.data = req.body.data
            hora.horario = req.body.horario
            hora.procedimento = req.body.procedimento
            hora.observacao = req.body.observacao
            horarioAlterado = hora
        }
    }
    res.status(200).send(horarioAlterado)
})

app.get('/horarios/:idhorario', (req, res) => {
    let idhorario = req.params.idhorario
    let horarioRetornado = {}
    for (let hora of dados) {
        if (hora.id == idhorario) {
            horarioRetornado = hora;
            break;
        }
    }
    res.status(200).send(horarioRetornado)
})

app.delete('/horarios/:idhorario', (req, res) => {
    let idhorario = req.params.idhorario
    let posicao = 0
    for (let hora of dados) {
        if (hora.id == idhorario) {
            break
        }
        posicao++
    }
    dados.splice(posicao, 1)
    res.status(204).send()

})

app.listen(8081, () => console.log('Aplicação em execução na url http://localhost:8081'))