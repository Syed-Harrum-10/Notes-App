const {CREATE, READ, UPDATE, DELETE} = require('../controller/notesService')
const Middleware = require('../middleware/authMiddleware')
const router = require('express').Router()


router.post('/Create', Middleware, CREATE)
router.get('/Read', Middleware, READ)
router.put('/Update', Middleware, UPDATE)
router.delete('/Delete', Middleware, DELETE)


module.exports = router