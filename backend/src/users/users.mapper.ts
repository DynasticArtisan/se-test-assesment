import { UserDoc } from "./users.model";
import { User } from "@generated/types";

export function mapUser(doc: UserDoc): User {
    return {
        id: doc._id.toString(),
        email: doc.email,
        name: doc.name,
    }
}