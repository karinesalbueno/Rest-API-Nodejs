const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {

    mysql.getConnection((error, connection) => {
        if (error) { return res.status(500).send({ error: error }) }

        connection.query(
            'SELECT * FROM produtos',
            (error, resultado) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(201).send({ response: resultado })
            }
        )
    })
});

router.post('/', (req, res, next) => {

    mysql.getConnection((error, connection) => {
        connection.query(
            'INSERT INTO produtos (nome, valor) VALUES (?, ?)',
            [req.body.nome, req.body.valor],

            (error, resultado) => {
                connection.release();

                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                res.status(201).send({
                    mensagem: 'Produto inserido com sucesso!',
                    id_produto: resultado.insertId
                })
            }
            //release nao acumula conexões
        )
    })


});


router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    mysql.getConnection((error, connection) => {
        if (error) { return res.status(500).send({ error: error }) }

        connection.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.params.id_produto],
            (error, resultado) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(201).send({ response: resultado })
            }
        )
    })
});


router.patch('/', (req, res, next) => {
    mysql.getConnection((error, connection) => {
        connection.query(
            `UPDATE produtos 
                     set nome = ?, 
                          valor = ?
                 WHERE id_produto = ?`,
            [req.body.nome, req.body.valor, req.body.id_produto],

            (error, resultado) => {
                connection.release();
                if (error) {return res.status(500).send({error: error})}
                res.status(202).send({
                    mensagem: 'Produto alterado com sucesso!',
                })
            }
        )
    })

})

router.delete('/', (req, res, next) => {
    mysql.getConnection((error, connection) => {
        connection.query(
            `DELETE from produtos 
                 WHERE id_produto = ?`,
            [req.body.id_produto],

            (error, resultado) => {
                connection.release();
                if (error) {return res.status(500).send({error: error})}
                res.status(202).send({
                    mensagem: 'Produto removido com sucesso!',
                })
            }
        )
    })
})


module.exports = router;