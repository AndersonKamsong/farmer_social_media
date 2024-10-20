// server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const groupMembershipRoutes = require('./routes/groupMembership');
const postRoutes = require('./routes/post');
const notificationRoutes = require('./routes/notification');
const adminActionRoutes = require('./routes/adminAction');
const messageRoutes = require('./routes/messages');
const db = require('./config/db');
const dotenv = require('dotenv');
const { authenticateJWT } = require('./middleware/auth');
const http = require('http');
const socketIo = require('socket.io');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const Message = require('./models/Message');

dotenv.config();
const process = require('process');
const cwd = process.cwd();

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Change this to your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/groups', groupRoutes);
app.use('/group-membership', groupMembershipRoutes);
app.use('/posts', postRoutes);
app.use('/notifications', authenticateJWT, notificationRoutes);
app.use('/admin-actions', authenticateJWT, adminActionRoutes);
app.use('/messages', messageRoutes);
app.use('/images', express.static(path.join(cwd, 'PostsImage')));
app.use('/group-images', express.static(path.join(cwd, 'GroupsImage')));


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for incoming messages
    socket.on('sendMessage', (message) => {
        // Emit the message to the intended receiver
        // socket.emit('receiveMessage', message);
        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

app.post('/api/uploadFile/:id', async (req, res) => {
    try {
        // Basic setup
        const id = req.params.id
        const form = new formidable.IncomingForm()
        const currentDir = cwd;
        // console.log("currentDir", currentDir);
        const uploadDir = path.join(currentDir, 'PostsImage');
        fs.mkdirSync(uploadDir, { recursive: true });
        // Basic Configuration
        form.multiples = true
        form.maxFileSize = 50 * 1024 * 1024 // 5MB
        form.uploadDir = uploadDir
        let imageFiles = []
        // Parsing
        await form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('Error parsing the files', err)
                return res.status(400).json({
                    error: 'There was an error parsing the files',
                })
            }
            // console.log("files.image :", files.images.length)
            imageFiles = files.images;
            // console.log("good here");
            if (!imageFiles) {
                return res.status(400).send({ error: 'No files were uploaded.' });
            }
            let names = []
            for (let index = 0; index < imageFiles.length; index++) {
                let oldPath = uploadDir + '/' + imageFiles[index].newFilename
                let newPath = uploadDir + '/' + id
                fs.renameSync(oldPath, newPath);
            }
            // console.log(imageStr);
            return res.status(200).json({
                message: 'Ok ',
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(501).send({ error: 'Server error.' });
    }
});
app.post('/api/groupImage/:id', async (req, res) => {
    try {
        // Basic setup
        const id = req.params.id
        const form = new formidable.IncomingForm()
        const currentDir = cwd;
        // console.log("currentDir", currentDir);
        const uploadDir = path.join(currentDir, 'GroupsImage');
        fs.mkdirSync(uploadDir, { recursive: true });
        // Basic Configuration
        form.multiples = true
        form.maxFileSize = 50 * 1024 * 1024 // 5MB
        form.uploadDir = uploadDir
        let imageFiles = []
        // Parsing
        await form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('Error parsing the files', err)
                return res.status(400).json({
                    error: 'There was an error parsing the files',
                })
            }
            // console.log("files.image :", files.images.length)
            imageFiles = files.images;
            // console.log("good here");
            if (!imageFiles) {
                return res.status(400).send({ error: 'No files were uploaded.' });
            }
            let names = []
            for (let index = 0; index < imageFiles.length; index++) {
                let oldPath = uploadDir + '/' + imageFiles[index].newFilename
                let newPath = uploadDir + '/' + id
                fs.renameSync(oldPath, newPath);
            }
            // console.log(imageStr);
            return res.status(200).json({
                message: 'Ok ',
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(501).send({ error: 'Server error.' });
    }
});
// Export the io instance for use in other modules
module.exports = {
    socketIo,
    io
};
