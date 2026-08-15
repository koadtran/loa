const express= require('express');
const prisma = require('../prisma/prisma');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({error: "Username and password are required"})
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Username must be 3-30 characters' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username: username.toLowerCase(),
                password: hashedPassword
            },
            select: {id: true, username: true, createdAt: true}
        });
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            res.status(201).json(user);
        });
    } catch (err) {
        if (err.code === '`P2002`') {
            return res.status(409).json({error: 'Username already taken'});
        }
        next(err);
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({id: req.user.id, username: req.user.username})
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json({ok: true});
  });
});

router.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({error: 'Not authenticated'});
    }
    res.json(req.user);
});

module.exports = router;