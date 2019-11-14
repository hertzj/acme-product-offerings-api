const express = require('express');
const path = require('path');
const PORT = 3000;

const app = express();

const {
    syncAndSeed,
    Product,
    Company,
    Offering
} = require('./db.js');

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './index.html'));
})

app.get('/api/products', (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.send(products)
        })
        .catch(next)
});


app.get('/api/companies', (req, res, next) => {
    Company.findAll()
        .then(companies => {
            res.send(companies)
        })
        .catch(next)
});


app.get('/api/offerings', (req, res, next) => {
    Offering.findAll()
        .then(offerings => {
            res.send(offerings)
        })
        .catch(next)
});

app.listen(PORT, () => {
    console.log('things are going well')
})



syncAndSeed()