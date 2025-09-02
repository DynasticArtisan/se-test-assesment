import { ApolloServer, UserInputError } from "apollo-server";
import { join } from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { connectDB } from "@config/database";
import { usersResolvers } from "@src/users";
import { EmailScalar } from "@src/scalars";
import { GraphQLError } from "graphql";

const loadedTypeDefs = loadFilesSync(join(__dirname, "**/*.graphql"));

export const createServer = async () => {
    try {
      await connectDB();

      const server = new ApolloServer({
        typeDefs: mergeTypeDefs(loadedTypeDefs),
        resolvers: mergeResolvers([
          usersResolvers,
          {
            Email: EmailScalar,
          },
        ]),
        formatError: (err) => {
          console.error(err);
      
          if (err instanceof UserInputError) {
            return {
              message: err.message,
              code: err.extensions?.code || "BAD_USER_INPUT",
            };
          }

          if (err instanceof GraphQLError) {
            return {
              message: err.message,
              code: err.extensions?.code || "INTERNAL_ERROR",
            };
          }
      
          return {
            message: "Internal server error",
            code: "INTERNAL_ERROR",
          };
        },
      });

      const { url } = await server.listen({ port: process.env.PORT });
      console.log(`Server started at ${url}`);
      return server;

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
};