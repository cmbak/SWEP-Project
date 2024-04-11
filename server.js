const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const MONGODB_URI =
    'mongodb+srv://admin:fdmprojectlogin@cluster0.w9vvdu2.mongodb.net/FDMFlatFinder?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: Boolean,
});

const RemovedAccomSchema = new mongoose.Schema({
    accom_id: Number,
});

const Users = mongoose.model('Users', UserSchema, 'Users');
const RemovedAccom = mongoose.model(
    'RemovedAccom',
    RemovedAccomSchema,
    'RemovedAccom'
);

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Users.findOne({ username, password }).lean();
        if (user) {
            res.status(200).json({
                message: 'Login successful',
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/removedAccoms', async (req, res) => {
    try {
        const removedAccoms = await RemovedAccom.find(
            {},
            { accom_id: 1, _id: 0 }
        ); // Only gets the accom_id field
        const accomIds = [];
        removedAccoms.forEach((obj) => {
            accomIds.push(obj['accom_id']);
        });
        res.status(200).json({ removedAccoms: accomIds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/removeAccom', async (req, res) => {
    const { id } = req.body;
    try {
        await RemovedAccom.insertMany({
            accom_id: id,
        });
        res.status(200).json({ accomRemoved: id });
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
