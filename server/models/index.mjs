import mongoose from 'mongoose'
import User from './User.mjs';

const connectDb = () => {
    return mongoose.connect(
            process.env.DB_PATH || 'mongodb://localhost:27017/ssin', { 
                useNewUrlParser: true, 
                useFindAndModify: false , 
                useUnifiedTopology: true, 
                useCreateIndex: true ,
                user: process.env.DB_USER,
                pass: process.env.DB_PASSWORD,
                authSource: 'admin'
        }
    );
};

export { connectDb, User }
