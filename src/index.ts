
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from "express";
import createError from "http-errors"
import router from './route';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { customerAgentChatRoute } from './route/customer.agent.chat.route';
import { GetLiveCallQueueBySocketIORoute } from './route/live.call.route';

declare global {
  namespace Express {
    export interface Request {
      jwtPayload?: any;
      fileValidationError?: string;
    }
  }
}

const app = express()
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use('/', router);
customerAgentChatRoute(io)
GetLiveCallQueueBySocketIORoute(io)

app.use((req: Request, res: Response, next: Function) => {
  next(createError(404));
});
const PORT = 8080
server.listen(PORT, () =>
  console.log(`⚡️[server]: Server is running at https://localhost:` + PORT)
)