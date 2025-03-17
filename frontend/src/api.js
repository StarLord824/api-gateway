import axios from "axios";
import { gql } from "@apollo/client";

const REST_BASE_URL = "http://localhost:5000";
const GRAPHQL_URL = "http://localhost:6000/graphql";

// Register User (REST API)
export const registerUser = (name, email, password) =>
  axios.post(`${REST_BASE_URL}/register`, { name, email, password });

// Login User (REST API)
export const loginUser = (email, password) =>
  axios.post(`${REST_BASE_URL}/login`, { email, password });

// Fetch Users (GraphQL API)
export const GET_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;
