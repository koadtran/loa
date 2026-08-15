const prisma = require('../prisma/prisma');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

passport.use(
    new LocalStrategy( async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {username: username}
            });

            if (!user) {
                return done(null, false, { message: "Invalid username or password" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Invalid username or password" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
        where: {id: id},
        select : {id: true, username: true, createdAt: true},
    });
    done(null, user);
  } catch(err) {
    done(err);
  }
});

module.exports = passport;
