const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

app.use(express.json()); // Parse JSON bodies

// Middleware to set CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

io.on('connection', socket => {
    console.log('New client connected');

    socket.on('message', ({ message, user_id }) => {
        if (!user_id) {
            console.error('User ID is missing');
            return;
        }
        const insertMessageQuery = 'INSERT INTO messages (message, user_id) VALUES (?, ?)';
        db.query(insertMessageQuery, [message, user_id], (err, result) => {
            if (err) throw err;

            const selectUserQuery = 'SELECT name FROM users WHERE id = ?';
            db.query(selectUserQuery, [user_id], (err, results) => {
                if (err) throw err;

                const user = results[0];
                io.emit('message', { message, user_name: user.name });
            });
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('Backend is running');
});

server.listen(4000, () => console.log('Server is running on port 4000'));
