const express = require('express')
const router = express.Router()
const { 
    getGoals,
    getallGoals,
    setGoal,
    updateGoal,
    deleteGoal 
 } = require('../controllers/goalController')

 const { protect } = require("../middleware/authMiddleware")
 const { protectAdmin } = require("../middleware/adminMiddleware")

router.route ('/users').get(protect, getGoals).post(protect, setGoal) 
router.route('/').get(protectAdmin, getallGoals)
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal)

module.exports = router 