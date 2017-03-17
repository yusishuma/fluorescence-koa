/**
 * Created by matonghe on 16/03/2017.
 */
import Router from 'koa-router';
const router = Router();
import { Exceptions, ExceptionHandler } from '../../exceptions';
import * as user_controller from '../../controllers/user_controllers';
import passport from 'koa-passport';
router.get('/me', passport.authenticate('local', { session: false }), user_controller.getUser);
router.post('/register', user_controller.registerUser);
router.post('/login', function(ctx, next) {
    return passport.authenticate('local', function(err, user, info, status) {
        if (user === false) {
            ctx.status = 401;
            throw new Exceptions.Unauthenticated(`Endpoint [${ctx.request.url}] Unauthenticated.`);
        } else {
            ctx.body = { success: true };
            return ctx.login(user)
        }
    })(ctx, next)
}, user_controller.login);
export default router;
