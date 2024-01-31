const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.auth, userController.indexUsers)
router.get('/:userId/contacts', userController.auth, userController.indexContacts)
router.post('/', userController.createUser)
router.post('/login', userController.loginUser)
router.post('/:userId/contacts/add/:contactId', userController.auth, userController.addContact)
router.post('/:userId/contacts/remove/:contactId', userController.auth, userController.removeContact)
router.put('/:userId', userController.auth, userController.updateUser)
router.delete('/:userId', userController.auth, userController.deleteUser)
router.get('/:id', userController.auth, userController.showUser)

module.exports = router