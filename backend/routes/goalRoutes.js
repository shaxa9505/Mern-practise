const express = require("express");
const router = express.Router();
const {getGoals, postGoal, putGoal, deleteGoal} = require("../controllers/goalController")

const { protect } = require("../middleware/authMiddleware")

// qisqargan yuli
router.route("/").get(protect, getGoals).post(protect, postGoal);
router.route("/:id").put(protect, putGoal).delete(protect, deleteGoal);

// 1-yuli
// router.get("/", getGoals)
// router.post("/", postGoal)
// router.put("/:id", putGoal)
// router.delete("/:id", deleteGoal)


module.exports = router;