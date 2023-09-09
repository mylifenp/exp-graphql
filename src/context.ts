import { type Request, type Response } from "express";
import { type RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import mongoose, { Models } from "mongoose";
import { UserTokenInfo } from "./helpers/interfaces";

export interface Context {
  req: Request;
  res: Response;
  pubsub: RedisPubSub;
  redisClient: Redis;
  db: typeof mongoose;
  models: Models;
  me: UserTokenInfo;
}
