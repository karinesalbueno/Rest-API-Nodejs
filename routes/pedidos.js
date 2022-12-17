const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


router.get('/', (req, res, next) =>{
    mysql.getConnection((error, connection) => {
        if (error) { return res.status(500).send({ error: error }) }

        connection.query(
            'SELECT * FROM pedidos',
            (error, result) => {
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    quantidade: result.length,
                    pedidos: result.map(ped => {
                        return {
                            id_pedido: ped.id_pedido,
                            id_produto: ped.id_produto,
                            quantidade: ped.quantidade,
                        }
                    })
                }
                return res.status(201).send(response)
            }
        )
    })
});

router.post('/', (req, res, next)=>{
    mysql.getConnection((error, connection) => {
        connection.query(
            'INSERT INTO pedidos (id_produto, quantidade) VALUES (?, ?)',
            [req.body.id_produto, req.body.quantidade],

            (error, result) => {
                connection.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Pedido criado com sucesso!',
                    pedidoCriado: {
                        id_pedido: result.id_pedido,
                        id_produto: req.id_produto,
                        quantidade: req.body.quantidade,
                    }
                }
                res.status(201).send(response)
            }
        )
    })

})

router.get('/:id_pedido', (req, res, next) =>{

    mysql.getConnection((error, connection) => {
        if (error) { return res.status(500).send({ error: error }) }

        connection.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?',
            [req.params.id_pedido],
            (error, resultado) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(201).send({ response: resultado })
            }
        )
    })
});

router.delete('/', (req, res, next)=>{
    mysql.getConnection((error, connection) => {
        connection.query(
            `DELETE from pedidos 
                 WHERE id_pedido = ?`,
            [req.body.id_pedido],

            (error, resultado) => {
                connection.release();
                if (error) { return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Produto removido com sucesso!',
                })
            }
        )
    })
})


module.exports = router;