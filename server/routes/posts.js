const express= require('express');
const prisma = require('../prisma/prisma');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
            orderBy: {createdAt: 'desc'},
            take: 50,
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {select: { id: true, username: true}},
                _count: {select: {likes: true, comments: true}}
            }
        });
        res.json(posts);
    } catch (err) {
        console.log("Fetching posts error")
        next(err);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const post = await prisma.post.create({
            data: {
                content: req.body.content.trim(),
                authorId: req.user.id,
            },
        });
        res.json(post);
    } catch (err)  {
        next(err);
    }
});
// router.put('/:id');
// router.delete('/:id');

module.exports = router;

