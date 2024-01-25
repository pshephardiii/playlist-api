const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/contacts/:userId/:contactId', userController.auth, userController.addContact)
router.post('/contacts/:userId/remove/:contactId', userController.auth, userController.removeContact)
router.put('/:id', userController.auth, userController.updateUser)
router.delete('/:id', userController.auth, userController.deleteUser)

module.exports = router