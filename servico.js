const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

var cors = require('cors')
app.use(cors())

var pg = require('pg')

var consString = process.env.DATABASE_URL;
var port = process.env.PORT;

const pool = new pg.Pool({ connectionString: consString, ssl: { rejectUnauthorized: false } })

app.get('/', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        res.status(200).send('Conectado com sucesso!')
    })
})

app.post('/servicos', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }

        client.query('select * from servicos where nome = $1', [req.body.nome], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada')
            }

            if (result.rowCount > 0) {
                return res.status(200).send('Serviço já cadastrado!')
            }

            var sql = 'insert into servicos (nome, descricao, preco, duracao, status) values ($1, $2, $3, $4, $5)'
            client.query(sql, [req.body.nome, req.body.descricao, req.body.preco, req.body.duracao, req.body.status], (error, result) => {
                if (error) {
                    return res.status(403).send('Operação não permitida!')
                }
                res.status(201).send({
                    mensagem: 'Serviço criado com sucesso!',
                    status: 201
                })
            })

        })
    })
})


app.get('/servicos', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            res.status(401).send('Conexão não autorizada!')
        }
        client.query('select * from servicos', (error, result) => {
            if (error) {
                return res.status(401).send('Não foi possível realizar a consulta!')
            }
            res.status(200).send(result.rows)
        })
    })
})

app.get('/servicos/:id', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        client.query('select * from servicos where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            res.status(201).send(result.rows[0])
        })
    })
})

app.delete('/servicos/:id', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        client.query('delete from servicos where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            res.status(201).send({
                mensagem: 'Serviço deletado com sucesso!',
                status: 201
            })
        })
    })
})

app.put('/servicos/:id', (req, res) => {
    //res.status(200).send('Rota update criada')
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }

        client.query('select * from servicos where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            // update usuarios set senha = $1, perfil = $2 where email=$3
            if (result.rowCount > 0) {
                var sql = 'update servicos set nome = $1, descricao = $2, preco = $3, duracao = $4, status = $5     where id = $6'
                let valores = [req.body.nome, req.body.descricao, req.body.preco, req.body.duracao, req.body.status, req.body.id]
                client.query(sql, valores, (error2, result2) => {
                    if (error2) {
                        return res.status(401).send('Operação não permitida!')
                    }
                    if (result2.rowCount > 0) {
                        return res.status(200).send('Servico alterado com sucesso!')
                    }
                })
            } else
                res.status(200).send('Serviço não encontrado na base de dados!')

        })
    })
})

app.listen(port, () => console.log('Aplicação em execução na url http://localhost:8081'))