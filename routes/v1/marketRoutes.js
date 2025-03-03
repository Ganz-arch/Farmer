const express = require('express')
const {createMarketHandler,
    retrieveMyProductsHandler,
    retrieveMarketsHandler,
    retrieveMarketHandler,
    updateMarketHandler,
    deleteMarketHandler,} = require('../../controllers/v1/marketController')
const{validateUserToken} = require('../../middleware/auth')

const router=express.Router()

router.get('/myproduct', validateUserToken(['admin', 'seller']), retrieveMyProductsHandler)
router.post('', validateUserToken(['admin','seller']), createMarketHandler)
router.get('', validateUserToken(['admin', 'seller', 'buyer']), retrieveMarketsHandler)
router.get('/:id', validateUserToken(['admin','seller', 'buyer']), retrieveMarketHandler)
router.put('/:id', validateUserToken(['admin','seller']), updateMarketHandler)
router.delete('/:id', validateUserToken(['admin','seller']), deleteMarketHandler)

module.exports=router
