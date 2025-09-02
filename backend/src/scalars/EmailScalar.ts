import { GraphQLScalarType, Kind } from "graphql";

export const EmailScalar = new GraphQLScalarType({
  name: "Email",
  description: "Email scalar type, validates input",

  serialize(value) {
    return value;
  },

  parseValue(value) {
    if (typeof value !== "string") throw new Error("Email must be a string");
    if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) throw new Error("Invalid email format");
    return value;
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) throw new Error("Email must be a string");
    if (!ast.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) throw new Error("Invalid email format");
    return ast.value;
  },
});