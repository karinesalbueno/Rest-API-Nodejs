const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.status(200).send({
        mensagem: 'Get produtos'
    });
});

router.post('/', (req, res, next)=>{
    res.status(201).send({
        mensagem: 'Post produtos'
    })
})

router.get('/:id_produto', (req, res, next) =>{
    const id= req.params.id_produto

    res.status(200).send({
        mensagem: 'get por param',
        id:id
    });
});

router.patch('/:id_produto', (req, res, next)=>{
    res.status(201).send({
        mensagem: 'Patch produtos'
    })
})

router.delete('/', (req, res, next)=>{
    res.status(201).send({
        mensagem: 'Delete produtos'
    })
})


module.exports = router;