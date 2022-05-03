const express = require('express')
const app = express()
var cors = require('cors')

var dados = require('./dbservico')

/**Middleware para utilizar urlencoded */
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

/**middleware cors*/
app.use(cors());

app.get('/servicos', (req, res) => {
    res.status(200).send(dados)
})

app.post('/servicos', (req, res) => {
    let ob = {
        id: dados.length + 2,
        nome: req.body.nome,
        descricao: req.body.descricao,
        preco: req.body.preco,
        tempo: req.body.tempo,
        status: req.body.status
    }
    dados.push(ob)
    res.status(201).send(ob)
})

app.put('/servicos/:idservico', (req, res) => {
    let idservico = req.params.idservico;
    let servicoAlterado = {}
    for (let serv of dados) {
        if (serv.id == idservico) {
            serv.nome = req.body.nome
            serv.descricao = req.body.descricao
            serv.preco = req.body.preco
            serv.tempo = req.body.tempo
            serv.status = req.body.status
            servicoAlterado = serv
        }
    }
    res.status(200).send(servicoAlterado)
})

app.get('/servicos/:idservico', (req, res) => {
    let idservico = req.params.idservico
    let servicoRetornado = {}
    for (let serv of dados) {
        if (serv.id == idservico) {
            servicoRetornado = serv;
            break;
        }
    }
    res.status(200).send(servicoRetornado)
})

app.delete('/servicos/:idservico', (req, res) => {
    let idservico = req.params.idservico
    let posicao = 0
    for (let serv of dados) {
        if (serv.id == idservico) {
            break
        }
        posicao++
    }
    dados.splice(posicao, 1)
    res.status(204).send()

})

app.listen(8081, () => console.log('Aplicação em execução na url http://localhost:8081'))