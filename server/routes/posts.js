const express= require('express');
const prisma = require('../prisma/prisma');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const posts = await prisma.post.findMany({
                where: {
                    OR: [
                        {authorId: req.user.id},
                        {author: {followers: {some: {followerId: req.user.id}}}}
                    ]
                },
                orderBy: {createdAt: 'desc'},
                take: 50,
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    author: {select: { id: true, username: true}},
                    likes: {
                        where: {authorId: req.user.id},
                        select: {
                            author: {select: {id: true, username: true}}
                        }
                    },
                    comments: {select: {author: {select: {id: true, username: true}}}},
                    _count: {select: {likes: true, comments: true}}
                }
        });
        const postsArr = posts.map(post => {
            return {
                ...post,
                liked: post.likes.length > 0,
            }}
        );
        res.json(postsArr);
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
        console.log(err);
        next(err);
    }
});

// router.put('/:id');
// router.delete('/:id');

router.post('/:id/like', async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id);
        await prisma.like.create({
            data: {
                postId: postId,
                authorId: req.user.id
            }
        });
        res.status(201).json({ ok: true });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.delete('/:id/like', async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id);
        await prisma.like.deleteMany({
            where: {
                postId: postId,
                authorId: req.user.id
            }
        })
        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;

