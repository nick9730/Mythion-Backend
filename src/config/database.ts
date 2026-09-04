import mongoose  from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('  Connected Successfully');
    } catch (error) {
        console.error(' Connection Error:', (error as Error).message);
        process.exit(1);
    }
};

export default connectDB;