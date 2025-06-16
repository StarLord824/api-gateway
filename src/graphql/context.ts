import { JwtUser } from "../common/types";
import { JwtPayload } from "jsonwebtoken";

export interface GraphQLContext {
  user?: JwtUser;
  JwtPayload?: JwtPayload;
  req?: Express.Request;
}