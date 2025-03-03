const express = require('express')
const {createServiceHandler, getServiceHandler, getServicesHandler, updateServiceHandler, deleteServiceHandler} = require('../../controllers/v1/servicesController')
const {validateUserToken}=require('../../middleware/auth')

const routes = express.Router()

routes.post('', validateUserToken(['admin', 'seller']), createServiceHandler)
routes.get('/:id', validateUserToken(['admin', 'buyer', 'seller']), getServiceHandler)
routes.get('', validateUserToken(['admin', 'buyer', 'seller']), getServicesHandler)
routes.put('/:id', validateUserToken(['admin', 'seller']), updateServiceHandler)
routes.delete('/:id', validateUserToken(['admin', 'seller']), deleteServiceHandler)

module.exports=routes