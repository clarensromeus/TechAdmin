// external imports of sources
import * as dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import consola from "consola";
import bodyparser from "body-parser";
import morgan from "morgan";
import createError from "http-errors";
import passport from "passport";
import cors from "cors";
import responseTime from "response-time";
import session from "express-session";
import __ from "lodash";
// internal crafted imports of sources
import { SERVER_RUNNING_MESSAGE, REDIS_CLIENT } from "./constants/index";
import * as Auth from "./Route/index";
import { DB_CONNECTION } from "./utils/index";
import "./utils/Facebook_Auth";
import "./utils/Google_Auth";
import "./utils/Github_Auth";
import {
  SendingMail,
  CreateStudent,
  EditStudent,
  GetStudent,
  DeleteStudent,
  DeleteAdmin,
  GetAdmin,
  CreateAdmin,
  EditAdmin,
  GetStudentInfo,
} from "./Route/StudentAdmin_auth";
import StaffMembers from "./Route/Staff";
import {
  CreateTeacher,
  GetTeachers,
  DeleteTeacher,
  EditTeacher,
} from "./Route/Teachers";
import {
  GetAllSchedules,
  EditSchedule,
  CreateSchedule,
  DeleteSchedule,
} from "./Route/Calendar";
import SendPhoneMessage from "./Route/SendPhoneMessage";
import { GetPaymentToken, MakePayment, GetPaidStudent } from "./Route/Payment";
import Upload from "./utils/uploadFiles";
import { ChangeProfile } from "./Route/ChangeProfile";
import TalentedStudents from "./Route/TalentedStudents";
import {
  CreatePost,
  GetPosts,
  UserRelatedPosts,
  DeletePost,
  UpdatePost,
} from "./Route/Posts";
import { Suggestion } from "./Route/StudentSugestion";
import { Likes } from "./Route/Likes";
import { Comments, GetComments } from "./Route/Comments";
import { Chat, ImageChat, isSeenMessages } from "./Route/Chat";
import isOnline from "./Route/isOnline";
import { Follow, GetFriends, UnFollow } from "./Route/Friends";
import {
  Notifications,
  GetNotifications,
  DeleteNotifications,
} from "./Route/Notifications";
import {
  AdminDeleteNotifications,
  AdminGetNotifications,
  AdminNotifications,
  ClearAllNotifications,
} from "./Route/AdminNotification";
import { Share } from "./Route/Share";
import Retweet from "./Route/Retweet";
import { RecoverPassword } from "./Route/RecoverPassword";
import History from "./Route/History";
import DashboardStats from "./Route/dashboardStats";
import GetUserInfo from "./Route/GetUserInfo";
import RefreshClientToken from "./Route/Refresh_Token";
import AuthRedirection from "./Route/Auth_Redirection";
import LogOut from "./Route/Logout";
import { UserProfile, UserStats } from "./Route/Profile";

dotenv.config({ override: true });

const Server: Express = express();
// todo: FACEBOOK auth somehow require to use session if the goal is to make it work in a perfect way even we can use
// another way to store already-used data for one-way authentication
Server.use(
  session({
    secret: "my secret",
    resave: false, // do not resave session unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
const { PORT } = process.env;
const ServerPort = PORT || 5000;

const { StudentAdminRegister, StudentAdminLogin, tokenVerification } = Auth;

const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token", // client-server token authorization
    "Authorization",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,POST,DELETE,PATCH",
  origin: true,
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false,
};
// use for setting CROSS ORIGIN RESSOURCES SHARING between the server and the client
Server.use(cors(options));
// recording response time for every request in http servers
Server.use(responseTime());
// using body-parser for parsing incoming request bodies to the Express Middlewares
Server.use(bodyparser.urlencoded({ extended: true }));
Server.use(bodyparser.json());
// an express middleware for parsing incoming request loggers for a good visualization
// on api Routes of the Server
Server.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);
// initialize passport
Server.use(passport.initialize());
Server.use("/public", express.static("src"));
Server.get("/home/dashboard", StaffMembers);
Server.get("/home/dashboard/:studentlevel", TalentedStudents);
Server.get("/home/teachers", GetTeachers);
Server.get("/home/students", GetStudent);
Server.get("/home/administrators/:limit", GetAdmin);
Server.get("/sendphone", SendPhoneMessage);
Server.get("/home/calendar/:limit", GetAllSchedules);
Server.get("/home/students/suggestion", Suggestion);
Server.get("/home/students/getNotifications/:_id", GetNotifications);
Server.get("/home/admin/gethistories", AdminGetNotifications);
Server.get("/home/profile/:status/:_id", UserProfile);
Server.get("/home/profile/:_id", UserStats);
Server.get("/home/posts", GetPosts);
Server.get("/home/students/:id", GetStudentInfo);
Server.get("/home/chat/messages/:_id", GetFriends);
Server.get("/home/dashboard/stats/total", DashboardStats);
Server.get("/home/payment/paid", GetPaidStudent);
Server.get("/home/payment/token", GetPaymentToken);
Server.get("/home/info/:status/:_id", GetUserInfo);
Server.get("/home/profile/user/posts/:_id", UserRelatedPosts);
Server.get("/refreshToken", RefreshClientToken);
Server.get("/auth/redirection", AuthRedirection);
Server.get("/home/Post/comments/:_id", GetComments);
Server.post("/sendmail", SendingMail);
Server.post("/home/payment/student", MakePayment);
Server.post("/home/posts/retweet", Retweet);
Server.post("/login/:status", StudentAdminLogin);
Server.post("/register/:status", StudentAdminRegister);
Server.post("/home/teachers/create", CreateTeacher);
Server.post("/home/student/create", CreateStudent);
Server.post("/home/administrators/create", CreateAdmin);
Server.post("/home/post/share", Share);
Server.post("/home/calendar/create", CreateSchedule);
Server.post("/home/posts/upload", Upload.single("file"), CreatePost);
Server.post("/home/posts/likes", Likes);
Server.post("/home/posts/comments", Comments);
Server.post("/home/Chat/messages", Chat);
Server.post("/home/student/Notifications", Notifications);
Server.post("/home/admin/histories", AdminNotifications);
Server.post("/home/students/Friends", Follow);
Server.put("/home/student/edit", EditStudent);
Server.put("/home/teacher/edit", EditTeacher);
Server.put("/home/administrators/edit", EditAdmin);
Server.put("/home/calendar/edit", EditSchedule);
Server.patch(
  "/home/profile/changePicture",
  Upload.single("file"),
  ChangeProfile
);
Server.patch("/home/student/Online", isOnline);
Server.patch("/home/post/update", UpdatePost);
Server.patch("/home/chat/sendImage", Upload.single("file"), ImageChat);
Server.patch("/recoverpassword", RecoverPassword);
Server.patch("/home/chat/isSeen", isSeenMessages);
Server.delete("/home/teacher/delete/:id/:id_user", DeleteTeacher);
Server.delete("/home/student/delete/:id/:id_user", DeleteStudent);
Server.delete("/home/admin/delete/:id/:id_user", DeleteAdmin);
Server.delete("/home/calendar/delete/:id", DeleteSchedule);
Server.delete("/home/friend/unfollow/:_id/:User", UnFollow);
Server.delete("/home/post/delete/:_id/:Image", DeletePost);
Server.delete(
  "/home/Notifications/student/:_id/:NotiId/:SenderId",
  DeleteNotifications
);
Server.delete(
  "/home/admin/history/:_id/:NotiId/:AdminID",
  AdminDeleteNotifications
);
Server.get("/home/histories/deleteall", ClearAllNotifications);
Server.delete("/home/logout", LogOut);

// FACEBOOK route
Server.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
    session: false,
  })
);

// route for returning failure or success message
Server.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/logout",
    failureMessage: true,
  }),
  async function (req: Request, res: Response) {
    try {
      res.redirect("http://localhost:3000/auth/redirection");
    } catch (error) {
      throw new createError.Unauthorized(`${error}`);
    }
  }
);

Server.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: "reset session" });
});

// GOOGLE route
Server.get(
  "/login/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// route for returning failure or success callback
Server.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/logout",
    failureMessage: true,
  }),
  async function (req: Request, res: Response) {
    try {
      res.redirect("http://localhost:3000/auth/redirection");
    } catch (error) {
      throw new createError.NotFound(`${error}`);
    }
  }
);

// GITHUB AUTH
Server.get(
  "/auth/github",
  passport.authenticate("github", {
    scope: ["email", "profile"],
  })
);

Server.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/logout" }),
  async function (req: Request, res: Response) {
    // Successful authentication, redirect home.
    try {
      res.redirect("http://localhost:3000/auth/redirection");
    } catch (error) {
      throw new createError.Unauthorized(`${error}`);
    }
  }
);

Server.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Server runs successfully");
});

const ServerStartup = async (message: string) => {
  try {
    // redisDB connection
    await REDIS_CLIENT.connect();
    // mongoDB connection
    await DB_CONNECTION(true);
    // start the server
    Server.listen(ServerPort, () => {
      consola.info({
        message: `🚀⚡️[server]: ${message} http://localhost:${ServerPort}`,
      });
    });
  } catch (err) {
    throw new Error(`${err}`);
  } finally {
    consola.info({
      message: "Server is launching",
    });
  }
};

ServerStartup(SERVER_RUNNING_MESSAGE);
