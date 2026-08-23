const express= require('express');
const prisma = require('../prisma/prisma');
const requireAuth = require('../middleware/requireAuth');
const {getIO} = require('../socket/io');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
    try {
        const conversations = await prisma.conversation.findMany({
            where: {participants: {some: {userId : req.user.id}}},
            orderBy: {createdAt: 'desc'},
            select: {
                id: true,
                createdAt: true,
                participants: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {createdAt: 'desc'},
                    take: 1,
                    select: {
                        content: true,
                        createdAt: true,
                        sender: {
                            select: {
                                id: true, 
                                username: true
                            }
                        }
                    }
                }
            }
        })

        res.json(
            conversations.sort((a, b) => {
                const aTime = new Date(a.messages[0]?.createdAt ?? a.createdAt);
                const bTime = new Date(b.messages[0]?.createdAt ?? b.createdAt);
                return bTime - aTime;
            })
        );
    } catch (err) {
        console.log(err);
        next(err);
    }
});

//must put username of the other person in the body
router.post('/', async (req, res, next) => {
    try {
        const otherPerson = await prisma.user.findUnique({
            where: {
                username: req.body.username
            },
            select: {
                id: true
            }
        })
        if (!otherPerson) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (otherPerson.id === req.user.id) {
            return res.status(400).json({ error: "Can't message yourself" });
        }

        const existing = await prisma.conversation.findFirst({
            where: {
                AND: [
                    {participants: {some: {userId: otherPerson.id}}},
                    {participants: {some: {userId: req.user.id}}}
                ]
            },
            include: {
                _count: {select: {participants: true}}
            }
        })

        if (existing && existing._count.participants == 2) {
            return res.json(existing);
        }

        const conversation = await prisma.conversation.create({
            data: {
                participants: {
                    create: [
                        {userId: otherPerson.id},
                        {userId: req.user.id}
                    ]
                }
            },
            select: {
                id: true,
                createdAt: true,
                participants: {
                    select: {user: {select: {id: true, username: true}}}
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: {
                        content: true,
                        createdAt: true,
                        sender: {select: {id: true, username: true}}
                    }
                }
            }
        });
        getIO()
            .to(`user-${req.user.id}`)
            .to(`user-${otherPerson.id}`)
            .emit('new-conversation', conversation);
        res.status(201).json(conversation);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get('/:id/messages', async (req, res, next) => {
    try {
        const conversationId = parseInt(req.params.id);

        const participant = await prisma.conversationParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId: req.user.id,
                    conversationId: conversationId
                }
            }
        });

        if (!participant) {
            return res.status(403).json({error: 'Not a participant'})
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversationId
            },
            orderBy: {createdAt: 'asc'},
            select: {
                id: true,
                content: true,
                createdAt: true,
                sender: {select: {id: true, username: true}}
            }
        });
        res.json(messages);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.post('/:id/messages', async (req, res, next) => {
    try {
        const conversationId = parseInt(req.params.id);

        const participant = await prisma.conversationParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId: req.user.id,
                    conversationId: conversationId
                }
            }
        });

        if (!participant) {
            return res.status(403).json({error: 'Not a participant'})
        }

        const content = req.body.content?.trim();

        if (!content) {
            return res.status(400).json({error: 'Empty message content'})
        }

        const message = await prisma.message.create({
            data: {
                content: content,
                conversationId: conversationId,
                senderId: req.user.id
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                sender: {select: {id: true, username: true}}
            }
        });
        getIO().to(`conversation-${conversationId}`).emit('new-message', {
            ...message,
            conversationId
        }); 
        res.status(201).json(message);
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = router;