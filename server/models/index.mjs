import mongoose from 'mongoose'
import user from './user.mjs';

const connectDb = () => {
    return mongoose.connect(process.env.DB_PATH || 'mongodb://localhost:27017/ssin', { useNewUrlParser: true, useFindAndModify: false , useUnifiedTopology: true, useCreateIndex: true });
};

export { connectDb, user }