var express = require('express');
var router = express.Router();
var vacationSQL = require('../sql/vacationSQL')
var moment=require('moment');

router.get('/:date/:date1', function(req, res) {
    var val=req.params;
    val.date=val.date+'%';
    val.date1='#'+val.date1+'%';
    vacationSQL.list(val).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    }) 
});

router.get('/:sdate/:edate/:id',function(req,res){
    var val= req.params;
    vacationSQL.read(val).then(r=>{
       res.send(r);
    }).catch(function (err){
       res.status(500).send(err.message)
    })
});


router.post('/', async function(req, res) {
    var keyword =req.body;
    await vacationSQL.insert(keyword).then(r=>{
        res.status(201).send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    }) 
});

router.delete('/:no', function(req, res) {
    var no =req.params;
    vacationSQL.delete(no).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    }) 
});

router.patch('/', function(req, res) {
    var keyword =req.body;
    vacationSQL.update(keyword).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    }) 
});

router.patch('/bigo', function(req, res) {
    var keyword =req.body;
    vacationSQL.bigo(keyword).then(r=>{
        res.send(r);
    }).catch(function (err){
        res.status(500).send(err.message)
    }) 
});





module.exports = router ;