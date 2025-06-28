const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app)

// intitate socket.io and attach this to http server
const io = socketIo(server)

require('dotenv').config()
const connectDB = require('./config/connectDB');
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userAuthRoutes')
const homeRouter = require('./routes/homeRoutes')
const adminRouter = require('./routes/adminRoutes')
const imageRouter = require('./routes/imageRoutes')
const productRouter = require('./routes/productRoutes')

const PORT = process.env.PORT || 8080;


app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static('public'))

app.use('/api/books',bookRouter);
app.use('/api/auth',userRouter);
app.use('/api/home',homeRouter)
app.use('/api/admin',adminRouter)
app.use('/api/images',imageRouter)
app.use('/api/products',productRouter)



// chatting application
const users = new Set(); // Fix: instantiate Set with 'new'

io.on('connection', (socket) => {
    console.log('A user is connected :' , socket.id);

    // handle users when they will join chat
    socket.on('join', (userName) => {
        users.add(userName);
        socket.userName = userName

        // broadcast to all clients/users that a new user has joined
        io.emit('userJoined', userName);

        // send the updated user list to all clients
        io.emit('userList', Array.from(users));
    });

    // handle incoming chat messages
    socket.on('chatMessage',(message)=>{
        // broadcast the received message to all clients
        io.emit('chatMessage',message);
    })

    // handle disconnetion
    socket.on('disconnect',() => {
        console.log('A user has been disconnected')

        users.forEach(user => {
            if(user === socket.userName){
                users.delete(user);

                io.emit('userLeft',user)

                io.emit('userList',Array.from(users))
            }
        })
    })
});

connectDB()
    .then(() => {
        server.listen(PORT, () => { // Fix: use server.listen for socket.io
            console.log(`server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });