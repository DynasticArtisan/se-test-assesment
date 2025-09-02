import { ApolloError } from "apollo-server";
import { FilterQuery, isValidObjectId } from "mongoose";
import { Users, UserDoc } from "./users.model";
import { mapUser } from "./users.mapper";
import { Resolvers } from "@generated/types";

export const usersResolvers: Resolvers = {
    Query: {
        user: async (_, { id }) => {
            const user = isValidObjectId(id) && await Users.findById(id).lean();
            if (!user) {
                throw new ApolloError(`User with id ${id} not found`, "USER_NOT_FOUND");
            }
            return mapUser(user);
        },
        users: async (_, { skip = 0, limit = 10, filter }) => {
            const query: FilterQuery<UserDoc> = {};

            if (filter?.search) {
                const regex = { $regex: filter.search, $options: "i" };
                query.$or = [
                    { name: regex }, 
                    //{ email: regex }
                ];
            }
            const users = await Users.find(query)
                .sort({ createdAt: -1, name: 1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return users.map(mapUser);
        },
    },
    Mutation: {
        createUser: async (_, { input }) => {
            const existingUser = await Users.findOne({ email: input.email }).lean();
            if (existingUser) {
              throw new ApolloError(`Email ${input.email} already in use`, "USER_EMAIL_CONFLICT");
            }

            const user = await Users.create(input);
            return mapUser(user);
        },
        updateUser: async (_, { id, input }) => {
            const user = isValidObjectId(id) && await Users.findById(id);
            if (!user) {
                throw new ApolloError(`User with id ${id} not found`, "USER_NOT_FOUND");
            }

            if (input.email && user.email !== input.email) {
                const existingUser = await Users.findOne({ email: input.email }).lean();
                if (existingUser) {
                  throw new ApolloError(`Email ${input.email} already in use`, "USER_EMAIL_CONFLICT");
                }
                user.email = input.email;
            }

            if (input.name) {
                user.name = input.name;
            }

            await user.save();

            return mapUser(user);
        },
        deleteUser: async (_, { id }) => {
            const user = isValidObjectId(id) && await Users.findById(id);
            if (!user) {
                throw new ApolloError(`User with id ${id} not found`, "USER_NOT_FOUND");
            }

            await user.deleteOne();

            return mapUser(user);
        }
    }
}