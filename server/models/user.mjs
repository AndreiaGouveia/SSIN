import mongoose from 'mongoose';

const User =  mongoose.model('User', new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    fullName: {
        type: String
    },
    clearanceLvl: {
        type: Number
    },
    stringId: {
        type: String,
        unique: true
    },
    publicKey: {
        type: String
    }
}));

User.findUser = async (name) => {
    return User.findOne({ username: name }).exec();
}


export default User;
