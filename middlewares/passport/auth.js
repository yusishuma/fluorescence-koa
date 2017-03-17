/**
 * Created by matonghe on 15/03/2017.
 */
const passport = require('koa-passport')
import User from "../../models";
const fetchUser = (() => {
    // This is an example! Use password hashing in your
    const user = { id: 1, username: 'test', password: 'test' }
    return async function() {
        return user
    }
})();

passport.serializeUser(function(user, done) {
    done(null, user.id)
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await fetchUser()
        done(null, user)
    } catch(err) {
        done(err)
    }
});

import {Strategy as LocalStrategy} from 'passport-local';
passport.use(new LocalStrategy.Strategy(function(username, password, done) {
    console.log('===================', username, password);
    done(null, true);
    // fetchUser()
    //     .then(user => {
    //         if (username === user.username && password === user.password) {
    //             done(null, user)
    //         } else {
    //             done(null, false)
    //         }
    //     })
    //     .catch(err => done(err))
}));
console.log("--=-==-=-===========")