import { Router } from "express";
import { createGroup, deletegroup, getgroup, getmembers, joinGroup } from "../controller/groupController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post('/',protect,createGroup);
router.post('/join',protect,joinGroup);
router.get('/',protect,getmembers);
router.get('/:grpid',getgroup);
router.delete('/:grpid',deletegroup);

export default router;