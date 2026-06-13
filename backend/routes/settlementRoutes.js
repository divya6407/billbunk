import Router from 'express';
import { activity, updatesettle, whoOwnswhom } from '../controller/settlementController.js';
import { protect } from '../middleware/authMiddleware.js';
const router =Router();

router.get("/balance/:grpid",whoOwnswhom);
router.patch("/:expid/settle",protect,updatesettle);
router.get("/activity/:grpid",activity);
export default router;