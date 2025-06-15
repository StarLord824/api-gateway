import { JwtUser } from '../common/types';

export interface GraphQLContext {
  user?: JwtUser;
  req?: Express.Request;
}