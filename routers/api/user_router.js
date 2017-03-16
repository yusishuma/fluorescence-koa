/**
 * Created by matonghe on 16/03/2017.
 */
import Router from 'koa-router';
const router = Router();
import * as user_controller from '../../controllers/user_controllers';
router.get('/me', user_controller.getUser);
router.post('/register', user_controller.registerUser);

export default router;
