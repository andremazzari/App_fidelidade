//external dependencies
import express, { Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
var cookieParser = require('cookie-parser');

//internal dependencies
import userRouter from './routes/UserRoutes';
import fidelityRouter from './routes/FidelityRoutes';


class Server {
    private server = express();

    _addCors() {
        const corsOptions = {
            origin: 'http://localhost:3000', // Allow only this origin to send requests
            credentials: true, // Allow cookies to be sent with requests
        };

        this.server.use(cors(corsOptions));
    }

    _loadEnvVariables() {
        dotenv.config();
    }

    run() {
        //Env variables
        this._loadEnvVariables();

        //Cors
        this._addCors();

        //Request types
        this.server.use(express.urlencoded({extended: true}));
        this.server.use(express.json());

        //cookies
        this.server.use(cookieParser())

        //routes
        this.server.use(userRouter);
        this.server.use(fidelityRouter);

        this.server.listen(process.env.PORT);
    }
}

const server = new Server();
server.run();