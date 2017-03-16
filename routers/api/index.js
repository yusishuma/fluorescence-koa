/**
 * Created by matonghe on 16/03/2017.
 */
import Router from 'koa-router';
const router = Router();
import user_router from './user_router';

router.use('/users', user_router.routes(), user_router.allowedMethods());

export default router;
