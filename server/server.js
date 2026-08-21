require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const prisma = require('./prisma/prisma');

const passport = require('./auth/passport');

const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
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
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);

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

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});