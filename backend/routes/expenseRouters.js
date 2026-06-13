import Router from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { createExpense ,deleteexpense,expenseForGroup, getpersonalbill, updateexpense , confirmsettle, getExpenseById} from '../controller/expenseController.js';

const router = Router();

router.post('/',protect,createExpense);
router.get("/user/personal",protect,getpersonalbill);
router.get("/:expid", protect, getExpenseById);
router.get("/group/:grpid", protect, expenseForGroup);
router.put("/:expid",protect,updateexpense);
router.delete("/:expid", protect, deleteexpense);
router.patch("/:expid/confirm", protect, confirmsettle);

export default router;