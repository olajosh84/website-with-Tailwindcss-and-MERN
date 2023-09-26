import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser"; 
import connectDB from "./db/connect.js";
//import { notFound } from "./middlewares/notFound2.js";
/*import CustomErrorHandler from "./middlewares/errors/customErrorHandler.js";
import errorHandler from "./middlewares/errors/errorHandler.js";*/
import { notFound, errorHandler } from "./middlewares/errors/errorHandler.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/users.js";
const origin = process.env.CLIENT_URI;
/**express middlewares */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin,
    method: ["POST", "GET", "PATCH", "PUT", "DELETE"],
    credentials: true
}));

/**test route: to be deleted 
app.get('/', (req, res) => res.send("<h1>This is the landing page!<h1>"));*/

/** endpoints */
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

/**calling my middlewares */
//app.use(notFound);
/**Errormiddlewares */
app.use(notFound);
app.use(errorHandler);

/**starts server and connects database at the same time. otherwise, fail */
const port = process.env.PORT || 8000;
const startServer = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        })
    } catch(err){
        console.log("Failed to connect to database");
        process.exit(1);
    }
    
}
startServer();
