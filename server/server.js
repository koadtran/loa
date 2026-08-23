require('dotenv').config();
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const {setIO} = require('./socket/io')
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const prisma = require('./prisma/prisma');

const passport = require('./auth/passport');

const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const conversationsRouter = require('./routes/conversations')

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const sessionMiddleware = session({
    store: new pgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/conversations', conversationsRouter);

app.get('/api/health', (req, res) => {
    res.json({status: 'ok', time: new Date().toISOString()});
});

app.use((err, req, res, next) => {
    console.log("Error middleware")
    console.log(err);
    res.status(err.statusCode || 500).json({
        status: err,
        message: err.message || 'Internal Server Error',
    });
});

if (process.env.NODE_ENV === 'production') {
    const dist = path.join(__dirname, '../frontend/dist');
    app.use(express.static(dist));
    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(dist, "index.html"));
    });
}

const server = http.createServer(app);
const io = new Server(server);
setIO(io);

io.engine.use(sessionMiddleware);

io.use((socket, next) => {
    const req = socket.request;
    passport.initialize()(req, {}, () => {
        passport.session()(req, {}, () => {
            if (req.user) {
                socket.user = req.user;
                next();
            } else {
                next(new Error('Unauthorized'));
            }
        });
    });
});

io.on('connection', (socket) => {
  socket.on('join-conversation', async (conversationId) => {
    try {
        const participant = await prisma.conversationParticipant.findUnique({
            where: {
                userId_conversationId: {
                    userId: socket.user.id,
                    conversationId: parseInt(conversationId)
                }
            }
        });

        if (!participant) {
            console.log(`${socket.user.username} was denied joining conversation-${conversationId}`);
            return;
        }
        socket.join(`conversation-${conversationId}`);
        console.log(`${socket.user.username} joined conversation-${conversationId}`);
    } catch (err) {
        console.log(err);
    }
  });

  socket.join(`user-${socket.user.id}`);
});


server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

