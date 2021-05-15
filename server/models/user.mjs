import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    name: {
        type: String
    },
    clearanceLvl: {
        type: Number
    },
    stringId: {
        type: String,
        unique: true
    }
});

export default mongoose.model('User', userSchema);
