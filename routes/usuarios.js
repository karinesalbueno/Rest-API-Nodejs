const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

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
          res
            .status(400)
            .send({ mensagem: 'usuário já cadastrado com este e-mail' })
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

router.post('/login', (req, res) => {
  mysql.getConnection((error, connection) => {
    if (error) {
      return res.status(500).send({ error: error })
    }

    connection.query(
      `SELECT * FROM usuarios WHERE email = ? `,
      [req.body.email],
      (error, result) => {
        if (error) {
          return res.status(500).send({ error: error })
        }
        if (result.length < 1) {
          res.status(400).send({ mensagem: 'falha na autenticação' })
        }
        bcrypt.compare(req.body.senha, result[0].senha, (error, result) => {
          if (error) {
            return res.status(401).send({ mensagem: 'falha na autenticação' })
          }
          if (result) {
            const token = jwt.sign(
              {
                id_usuario: result.id_usuario,
                email: result.email,
              },
              `${process.env.JWT_KEY}`,
              { expiresIn: "2h" },
            )
            return res
              .status(200)
              .send({ mensagem: 'autenticado com sucesso!', token: token })
          }
          return res.status(401).send({ mensagem: 'falha na autenticação' })
        })
      },
    )
  })
})

module.exports = router
