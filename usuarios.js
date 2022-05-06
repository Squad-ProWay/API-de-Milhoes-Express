const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

var cors = require('cors')
app.use(cors())

var pg = require('pg')

var consString = "postgres://vivupmyvfgnjjm:2f2ea8d79190de6f063ada7c6031e5f123cdb17ae9fc6066ebe08ecba10fbf07@ec2-18-210-64-223.compute-1.amazonaws.com:5432/dabi4uakl6ohbp"

const pool = new pg.Pool({ connectionString: consString, ssl: { rejectUnauthorized: false } })

app.get('/', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        res.status(200).send('Conectado com sucesso!')
    })
})

app.post('/usuarios', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }

        client.query('select * from usuarios where email = $1', [req.body.email], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada')
            }

            if (result.rowCount > 0) {
                return res.status(200).send('Email já está cadastrado!')
            }

            var sql = 'insert into usuarios (nome, email, cpf, senha, perfil) values ($1, $2, $3, $4, $5)'
            client.query(sql, [req.body.nome, req.body.email, req.body.cpf, req.body.senha, req.body.perfil], (error, result) => {
                if (error) {
                    return res.status(403).send('Operação não permitida!')
                }
                res.status(201).send({
                    mensagem: 'Usuário criado com sucesso!',
                    status: 201
                })
            })

        })
    })
})


app.get('/usuarios', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            res.status(401).send('Conexão não autorizada!')
        }
        client.query('select * from usuarios', (error, result) => {
            if (error) {
                return res.status(401).send('Não foi possível realizar a consulta!')
            }
            res.status(200).send(result.rows)
        })
    })
})

app.get('/usuarios/:id', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        client.query('select * from usuarios where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            res.status(201).send(result.rows[0])
        })
    })
})

app.delete('/usuarios/:id', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        client.query('delete from usuarios where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            res.status(201).send({
                mensagem: 'Usuário deletado com sucesso!',
                status: 201
            })
        })
    })
})

app.put('/usuarios/:id', (req, res) => {
    //res.status(200).send('Rota update criada')
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }

        client.query('select * from usuarios where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            // update usuarios set senha = $1, perfil = $2 where email=$3
            if (result.rowCount > 0) {
                var sql = 'update usuarios set nome = $1, email = $2, cpf = $3, senha = $4, perfil = $5     where id = $6'
                let valores = [req.body.nome, req.body.email, req.body.cpf, req.body.senha, req.body.perfil, req.body.id]
                client.query(sql, valores, (error2, result2) => {
                    if (error2) {
                        return res.status(401).send('Operação não permitida!')
                    }
                    if (result2.rowCount > 0) {
                        return res.status(200).send('Usuário alterado com sucesso!')
                    }
                })
            } else
                res.status(200).send('Usuário não encontrado na base de dados!')

        })
    })
})

app.listen(8081, () => console.log('Aplicação em execução na url http://localhost:8081'))