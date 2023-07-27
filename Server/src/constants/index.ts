import RedisClient from "@redis/client/dist/lib/client";
import * as redis from "redis";
import nodemailer from "nodemailer";

export const SERVER_RUNNING_MESSAGE = "Server is running at";
// redis db constant
export const REDIS_CLIENT = redis.createClient();
