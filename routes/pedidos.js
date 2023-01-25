const express = require('express')
const router = express.Router()
const mysql = require('../mysql').connection

router.get('/', (req, res) => {
  mysql.query(
    `SELECT pedidos.id_pedido, 
                   pedidos.quantidade,
                   produtos.id_produto,
                   produtos.nome,
                   produtos.valor
            FROM ecommerce.pedidos
            inner join produtos
            on produtos.id_produto = pedidos.id_produto; `,
    (error, result) => {
      if (error) {
        return res.status(500).send({ error: error })
      }

      const response = {
        quantidade: result.length,
        pedidos: result.map((ped) => {
          return {
            id_pedido: ped.id_pedido,
            quantidade: ped.quantidade,
            produto: {
              id_produto: ped.id_produto,
              nome: ped.nome,
              valor: ped.valor,
            },
          }
        }),
      }
      return res.status(201).send(response)
    },
  )
})

router.get('/:id_pedido', (req, res) => {
  mysql.query(
    'SELECT * FROM pedidos WHERE id_pedido = ?',
    [req.params.id_pedido],
    (error, resultado) => {
      if (error) {
        return res.status(500).send({ error: error })
      }
      return res.status(201).send({ response: resultado })
    },
  )
})

router.post('/', (req, res) => {
  mysql.query(
    'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)',
    [req.body.id_produto, req.body.quantidade],

    (error, result) => {
      if (error) {
        return res.status(500).send({ error: error })
      }

      const response = {
        mensagem: 'Pedido criado com sucesso!',
        pedidoCriado: {
          id_pedido: result.id_pedido,
          id_produto: req.id_produto,
          quantidade: req.body.quantidade,
        },
      }
      res.status(201).send(response)
    },
  )
})

router.delete('/', (req, res) => {
  mysql.query(
    `DELETE from pedidos 
                 WHERE id_pedido = ?`,
    [req.body.id_pedido],

    (error) => {
      if (error) {
        return res.status(500).send({ error: error })
      }
      res.json({
        mensagem: 'Produto removido com sucesso!',
      })
    },
  )
})

module.exports = router
