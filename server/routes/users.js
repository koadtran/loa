const express= require('express');
const prisma = require('../prisma/prisma');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                followers: {
                    where: {followerId: req.user.id},
                    select: {followerId: true}
                }
            }
        });
        
        res.json(users.map(user => {
            const {followers, ...rest} = user;
            return {...rest, followed: followers.length > 0}
        }));
    } catch (err) {
        next(err);
    }
});

router.get('/:username', async (req, res, next) => {
    try {
        const username = req.params.username;

        const target = await prisma.user.findUnique({
            where: {username},
            select: {id: true}
        });

        if (!target) {
            return res.status(404).json({error: 'User not found'});
        }

        const isOwnProfile = target.id === req.user.id;

        const followRow = isOwnProfile ? null : await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: req.user.id,
                    followingId: target.id
                }
            }
        });
        const isFollowing = isOwnProfile || followRow !== null;

        const user = await prisma.user.findUnique({
            where: {username},
            select: {
                id: true,
                username: true,
                posts: isFollowing ? {
                    orderBy: {createdAt: 'desc'},
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        author: {select: {id: true, username: true}},
                        _count: {select: {likes: true, comments: true}},
                        likes: {
                            where: {authorId: req.user.id},
                            select: {authorId: true}
                        },
                    },
                } : false,
                _count: {select: {followers: true, following: true, posts: true}},
            }
        });

        const postsWithLiked = (user.posts ?? []).map(post => {
            return {
                ...post,
                liked: post.likes.length > 0,
            }
        });

        res.json({
            ...user,
            posts: postsWithLiked,
            followed: isFollowing,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/:username/follow', async (req, res, next) => {
    try {
        const followingUser = await prisma.user.findUnique({
            where: {username: req.params.username},
            select: {id: true}
        });
        await prisma.follow.create({
            data: {
                followerId: req.user.id,
                followingId: followingUser.id
            }
        });
        res.status(201).json({ok: true});
    } catch (err) {
        console.log("Creating follow error")
        next(err);
    }
});

router.delete('/:username/follow', async (req, res, next) => {
    try {
        const followingUser = await prisma.user.findUnique({
            where: {username: req.params.username},
            select: {id: true}
        });
        await prisma.follow.deleteMany({
            where: {
                followerId: req.user.id,
                followingId: followingUser.id
            }
        });
        res.json({ok: true});
    } catch (err) {
        console.log("Deleting follow error")
        next(err);
    }
});


module.exports = router;
