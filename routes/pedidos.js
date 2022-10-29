const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Get pedidos'
    });
});

router.post('/', (req, res, next)=>{
    const pedido = {
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade
    }
    res.status(201).send({
        mensagem: 'Post pedidos',
        pedidoCriado: pedido
    })
})

router.get('/:id_pedido', (req, res, next) =>{
    const id= req.params.id_produto

    res.status(200).send({
        mensagem: 'get por param pedidos',
        id:id
    });
});

router.delete('/', (req, res, next)=>{
    res.status(201).send({
        mensagem: 'Delete pedidos'
    })
})


module.exports = router;