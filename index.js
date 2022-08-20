import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js"
import hotelsRoute from "./routes/hotels.js"
import roomsRoute from "./routes/rooms.js"

dotenv.config()

const connect = async () => {
    try {
       await mongoose.connect(process.env.MONGO) 
    } catch (error) {
        throw error
    }
}

mongoose.connection.on('disconnected', () => console.log("MongoDB disconnected"))
mongoose.connection.on("connected", () => console.log("MongoDB connected"))

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/hotels', hotelsRoute)
app.use('/api/rooms', roomsRoute)

app.use((err,req,res,next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || "Something went wrong"
    return res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMessage,
        stack: err.stack,
    });
});

app.listen(8080, () => {
    connect() 
    console.log('listening on port 8080!')
})