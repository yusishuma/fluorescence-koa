/**
 * Created by matonghe on 15/03/2017.
 */
import passport from "passport";
import User from "../../models";
import { BasicStrategy } from "passport-http";

passport.use(new BasicStrategy(
    function(phone, password, done) {
        User.findOne({ "account.phone": phone }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));
