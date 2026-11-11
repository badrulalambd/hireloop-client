import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("hireloopdb");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    user: {
        additionalFields: {
            role: {
                type: ["seeker", "recruiter", "admin"],
                // `input: true` lets the sign-up form send the role.
                // Keep `required: false` + `defaultValue` so sign-ups that
                // don't send a role (e.g. Google) still get "seeker".
                input: true,
                required: false,
                defaultValue: "seeker",
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        // Don't create a session on sign-up — the user must sign in
        // explicitly, so the session is only ever set at login.
        autoSignIn: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});