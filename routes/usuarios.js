const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')

router.post('/cadastro', (req, res) => {
  mysql.getConnection((error, connection) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    connection.query(
      'SELECT * FROM usuarios WHERE email = ? ',
      [req.body.email],
      (error, result) => {
        if (error) {
          return res.status(500).send({ error: error })
        }
        if (result.length > 0) {
          res.status(400).send({ mensagem: 'usuário já cadastrado com este e-mail' })
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt })
            }

            connection.query(
              `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
              [req.body.email, hash],
              (error, result) => {
                connection.release()
                if (error) {
                  return res.status(500).send({ error: error })
                }
                return res.status(201).send({
                  mensagem: 'Usuário criado com sucesso!',
                })
              },
            )
          })
        }
      },
    )
  })
})

module.exports = router
