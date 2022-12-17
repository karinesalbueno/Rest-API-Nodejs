const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

const multer = require ('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, './uploads')
    },
    filename: function (req, file, callback){
        callback(null, file.originalname)
    }
})
const upload = multer({ storage: storage})

router.get('/', (req, res, next) => {

    mysql.getConnection((error, connection) => {
        if (error) { return res.status(500).send({ error: error }) }

        connection.query(
            'SELECT * FROM produtos',
            (error, result) => {
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            valor: prod.valor,
                            imagem_produto: prod.imagem_produto
                        }
                    })
                }
                return res.status(201).send(response)
            }
        )
    })
});

router.post('/', upload.single('file') ,(req, res, next) => {
    console.log(req.file)
    mysql.getConnection((error, connection) => {
        connection.query(
            'INSERT INTO produtos (nome, valor, imagem_produto) VALUES (?, ?, ?)',
            [
                req.body.nome, 
                req.body.valor,
                req.file.path
            ],

            (error, result) => {
                connection.release();

                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Produto inserido com sucesso!',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        valor: req.body.valor,
                        // imagem_produto: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'Inserindo produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }

                res.status(201).send(response)
            }
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
                if (error) { return res.status(500).send({ error: error }) }
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
                if (error) { return res.status(500).send({ error: error }) }
                res.status(202).send({
                    mensagem: 'Produto removido com sucesso!',
                })
            }
        )
    })
})


module.exports = router;