const express = require('express')
const router = express.Router()
const mysql = require('../mysql').connection
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/cadastro', (req, res) => {
  //verifica se já existe o email cadastrado
  mysql.query(
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
        //encriptografa a senha
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
          if (errBcrypt) {
            return res.status(500).send({ error: errBcrypt })
          }

          //insere no banco
          mysql.query(
            `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
            [req.body.email, hash],
            (error, result) => {
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
      if (error) {
        return res.status(500).send({ error: error })
      }
    },
  )
})

router.post('/login', (req, res) => {
  mysql.query(
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
            { expiresIn: '2h' },
          )
          return res
            .status(200)
            .send({ mensagem: 'autenticado com sucesso!', token: token })
        }
        return res.status(401).send({ mensagem: 'falha na autenticação' })
      })
      if (error) {
        return res.status(500).send({ error: error })
      }
    },
  )
})

module.exports = router
