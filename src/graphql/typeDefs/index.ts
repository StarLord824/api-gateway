import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'graphql-tag';

const baseTypeDefs = readFileSync(
  join(__dirname, 'base.graphql'),
  'utf-8'
);

const userTypeDefs = readFileSync(
  join(__dirname, 'user.graphql'),
  'utf-8'
);

export const typeDefs = gql`
  ${baseTypeDefs}
  ${userTypeDefs}
`;