// __________ ________   ____ _________________________
// \______   \\_____  \ |    |   \__    ___/\_   _____/
//  |       _/ /   |   \|    |   / |    |    |    __)_
//  |    |   \/    |    \    |  /  |    |    |        \
//  |____|_  /\_______  /______/   |____|   /_______  /
//         \/         \/                            \/
//
//

const express = require('express');
const product_controller = require('./controllers/product.controller');
const router = express.Router();

// a simple test url to check that our app is up and running
router.get('/test', function (req, res) {
    res.send('Hello World!');
    console.log("Tested")

});

router.get('/products/', product_controller.createProduct)

module.exports = router;