const express = require('express');
const app = express();
const pool = require('./db/pool');
const session = require('express-session');
const PgSessionStore = require('connect-pg-simple')(session);
const authRouter = require('./routes/auth');
const PORT = 3000;

if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is required. Start with node --env-file=.env src/app.js');
}

app.use(express.json());

app.use(session({
    store: new PgSessionStore({
        pool,
        tableName: 'session',
        createTableIfMissing: false
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use('/api/auth', authRouter);


app.get('/api/health', (req,res) => {
    res.send({status: "ok"})
})

app.get('/api/health/db', async (req,res) => {
    try {
        const result = await pool.query('SELECT current_database()');
        res.json({
            database: result.rows[0].current_database
        });

    } catch(err){
        console.error('Database check failed: ', err);
        res.status(503).json({
            error: 'Database unavailable'
        })
    }

})



app.listen(PORT, (err)=>{
    if(err) console.log(err);
    console.log("Listening at port: ", PORT);
})


