import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
    ): Token!

    signIn(login: String!, password: String!, ldapInfo: LdapInfo!): Token!
    logout(username: String!): Boolean!
    updateUser(username: String!): User!
    deleteUser(id: ID!): Boolean!
  }
  
  input LdapInfo {
    fullName: String!
    title: String!
    phone: String
    lastName: String!
    email: String!
  }  
  
  type LdapInfoOut {
    fullName: String!
    title: String!
    phone: String
    lastName: String!
    email: String!
  }  
  
  type Token {
    token: String!
    user: User!
  }

  type User {
    id: ID!
    username: String!
    ldapInfo: LdapInfoOut!
    role: String
  }
`;
