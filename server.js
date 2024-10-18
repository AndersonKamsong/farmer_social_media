const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user'); // Import user routes
const groupRoutes = require('./routes/group'); // Import group routes
const groupMembershipRoutes = require('./routes/groupMembership'); // Import group membership routes
const postRoutes = require('./routes/post'); // Import post routes
const notificationRoutes = require('./routes/notification'); // Import notification routes
const adminActionRoutes = require('./routes/adminAction'); // Import admin action routes
const db = require('./config/db'); // Ensure this points to your DB configuration
const dotenv = require('dotenv');
const {authenticateJWT} = require('./middleware/auth'); // Your authentication middleware

dotenv.config();
const process = require('process');
const cwd = process.cwd();
const path = require('path')
const fs = require('fs')
const formidable = require('formidable');

const app = express();
app.use(cors());
app.use(express.json());

// // Connect to the database
// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed:', err.stack);
//         return;
//     }
//     console.log('Connected to the database.');
// });

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes); // Use user routes
app.use('/groups', groupRoutes); // Use group routes
app.use('/group-membership', groupMembershipRoutes); // Use group membership routes
app.use('/posts', postRoutes); // Use post routes
app.use('/notifications', authenticateJWT, notificationRoutes); // Notification routes (authenticated)
app.use('/admin-actions', authenticateJWT, adminActionRoutes); // Admin action routes (authenticated)
app.use("/images", express.static(path.join(process.cwd(), 'PostsImage')));

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
