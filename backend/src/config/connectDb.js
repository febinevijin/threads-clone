import mongoose from 'mongoose';
import { appConfig } from './appConfig.js';

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(appConfig.mongoUrl);
    console.log(`mongo db connected to ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

export default connectDB;
