
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import typeDefs from './graphql/schema.js'
import pool from './graphql/db.js';
import resolvers from './graphql/resolvers.js'
import { ApolloServer } from 'apollo-server-express';

dotenv.config();

const app = express();

// Middleware setup

app.use(cors({ credentials: true}))
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 



const start = async () => {
    try {

      pool.getConnection();
  
      const server = new ApolloServer({ typeDefs, resolvers,  context: ({ req }) => ({ req }) });
  
      await server.start();
      
      server.applyMiddleware({ app });

      app.listen({ port: 8000 }, () =>
        console.log(`Server ready at http://localhost:8000${server.graphqlPath}`)
      );
    } catch (err) {
      console.error('Unable to connect to the database:', err.message);
    }
  };
  
  start();
