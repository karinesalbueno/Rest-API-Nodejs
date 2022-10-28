const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Get pedidos'
    });
});

router.post('/', (req, res, next)=>{
    res.status(201).send({
        mensagem: 'Post pedidos'
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