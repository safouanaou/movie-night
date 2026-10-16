const express = require('express');
const app = express();
const pool = require('./db/pool');
const authRouter = require('./routes/auth');
const PORT = 3000;
app.use(express.json());
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


