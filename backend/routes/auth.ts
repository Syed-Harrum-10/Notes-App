const router = require('express').Router()
const {Register, login , logout} = require('../controller/authService')
const middleware = require('../middleware/authMiddleware')

router.post('/register', Register)
router.post('/login', login),
router.post('/logout', Register, logout)


module.exports = router