const express= require('express');
const prisma = require('../prisma/prisma');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
            }
        });
        res.json(users);
    } catch (err) {
        next(err);
    }
});

router.get('/:username', async (req, res, next) => {
    try {
        const username = req.params.username;
        const user = await prisma.user.findUnique({
            where: {username: username},
            select: {
                id: true,
                username: true,
                posts: {
                    orderBy: {createdAt: "desc"},
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        author: {select: { id: true, username: true}},
                        _count: {select: {likes: true, comments: true}}
                    },
                },
                _count: {select: {followers: true, following: true, posts: true}},
            }
        });
        res.json(user);
    } catch (err) {
        console.log("Fetching posts error")
        next(err);
    }
});

module.exports = router;
