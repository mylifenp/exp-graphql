import { type Request, type Response } from "express";
import { GraphQLError } from "graphql";
import { type RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import mongoose, { Models } from "mongoose";

interface User {
  id: string;
  email: string;
}

export interface Context {
  req: Request;
  res: Response;
  pubsub: RedisPubSub;
  redisClient: Redis;
  db: typeof mongoose;
  models: Models;
  me: User;
}
