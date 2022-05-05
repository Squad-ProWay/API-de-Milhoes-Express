const express = require('express')
const app = express() 
var cors = require('cors')  

var dados = require('./dbusuarios')


/**Middleware para utilizar urlencoded */
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

/**middleware cors*/
app.use(cors());

app.get('/usuarios', (req, res) => {
    res.status(200).send(dados)
})

app.post('/cadusuario', (req, res) => {
    let ob = {
        id: dados.length + 1,
        nome: req.body.nome,
        email: req.body.email,
        cpf: req.body.cpf,
        senha: req.body.senha,
        perfil: req.body.perfil
    }
    dados.push(ob)
    res.status(201).send(ob)
})

app.get('/usuarios/:idusuario', (req, res) => {
    let idusuario = req.params.idusuario
    let usuarioRetornado = {}
    for (let user of dados) {
        if (user.id == idusuario) {
            usuarioRetornado = user;
            break;
        }
    }
    res.status(200).send(usuarioRetornado)
})

app.delete('/usuarios/:idusuario', (req, res) => {
    let idusuario = req.params.idusuario
    let posicao = 0
    for (let user of dados) {
        if (user.id == idusuario) {
            break
        }
        posicao++
    }
    dados.splice(posicao, 1)
    res.status(204).send()

})

app.put('/usuarios/:idusuario', (req, res) => {
    let idusuario = req.params.idusuario;
    let usuarioAlterado = {}
    for (let user of dados) {
        if (user.id == idusuario) {
            user.nome = req.body.nome
            user.email = req.body.email
            user.cpf = req.body.cpf
            user.senha = req.body.senha
            user.perfil = req.body.perfil
            usuarioAlterado = user
        }
    }
    res.status(200).send(usuarioAlterado)
})


app.listen(8081, () => console.log('Aplicação em execução na url http://localhost:8081'))