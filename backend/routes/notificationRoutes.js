import Router from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { deletenoti, getnoti, markread } from '../controller/notificationController.js';

const router = Router();

router.get('/',protect,getnoti);
router.patch('/:notiid/read',markread);
router.delete('/:notiid',deletenoti);

export default router;