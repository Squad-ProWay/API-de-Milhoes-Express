const express = require('express')
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

var cors = require('cors')
app.use(cors())

var pg = require('pg')

var consString = process.env.DATABASE_URL

const pool = new pg.Pool({ connectionString: consString, ssl: { rejectUnauthorized: false } })

app.get('/', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        res.status(200).send('Conectado com sucesso!')
    })
})



app.post('/horarios', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }

        client.query('select * from horarios where email = $1', [req.body.email], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada')
            }

            if (result.rowCount > 0) {
                return res.status(200).send('Você já realizou agendamento!')
            }

            var sql = 'insert into horarios (nome, telefone, email, dia, horario, procedimento, observacao) values ($1, $2, $3, $4, $5, $6, $7)'
            client.query(sql, [req.body.nome, req.body.telefone, req.body.email, req.body.dia, req.body.horario, req.body.procedimento, req.body.observacao], (error, result) => {
                if (error) {
                    return res.status(403).send('Operação não permitida!')
                }
                res.status(201).send({
                    mensagem: 'Agendamento criado com sucesso!',
                    status: 201
                })
            })

        })
    })
})


app.get('/horarios', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            res.status(401).send('Conexão não autorizada!')
        }
        client.query('select * from horarios', (error, result) => {
            if (error) {
                return res.status(401).send('Não foi possível realizar a consulta!')
            }
            res.status(200).send(result.rows)
        })
    })
})

app.get('/horarios/:id', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        client.query('select * from horarios where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            res.status(201).send(result.rows[0])
        })
    })
})

app.delete('/horarios/:id', (req, res) => {
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }
        client.query('delete from horarios where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            res.status(201).send({
                mensagem: 'Agendamento deletado com sucesso!',
                status: 201
            })
        })
    })
})

app.put('/horarios/:id', (req, res) => {
    //res.status(200).send('Rota update criada')
    pool.connect((err, client) => {
        if (err) {
            return res.status(401).send('Conexão não autorizada!')
        }

        client.query('select * from horarios where id = $1', [req.params.id], (error, result) => {
            if (error) {
                return res.status(401).send('Operação não autorizada!')
            }
            // update usuarios set senha = $1, perfil = $2 where email=$3
            if (result.rowCount > 0) {
                var sql = 'update horarios set nome = $1, telefone = $2, email = $3, dia = $4, horario = $5, procedimento = $6, observacao = $7 where id = $8'
                let valores = [req.body.nome, req.body.telefone, req.body.email, req.body.dia, req.body.horario, req.body.procedimento, req.body.observacao, req.body.id]
                client.query(sql, valores, (error2, result2) => {
                    if (error2) {
                        return res.status(401).send('Operação não permitida!')
                    }
                    if (result2.rowCount > 0) {
                        return res.status(200).send('Agendamento alterado com sucesso!')
                    }
                })
            } else
                res.status(200).send('Agendamento não encontrado na base de dados!')

        })
    })
})



app.listen(8081, () => console.log('Aplicação em execução na url http://localhost:8081'))