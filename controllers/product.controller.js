const Product = require('../models/product.model');

function generateRandomInt(min, max) {
    let value = parseInt(Math.random() * (max - min) + min);
    return value;
}

module.exports = {

    //Simple version, without validation or sanitation
    test: function(req, res) {
        res.send('Greetings from the Test method!');
    },

    createProduct: function(req, res) {
        let product = new Product({
            name:"Banana",
            price: 10 + generateRandomInt(-2, 2),
        });

        product.save(function(err) {
            if (err) {
                console.log(err)
                res.status(500).send('Product couldn\'t be saved :(');
            }
            res.status(201).send(product)
        })
    },

    getProduct: function(req, res) {
        Product.findById(req.params.id, function(err, product) {
            if (err){
            console.log(err)
            res.status(500).send('Request couldn\'t be processed :(');
            }

            if(product != null)
            res.status(200).send(product)
            else
            res.status(404).send('Product couldn\'t be found :(');

        })
    },
}