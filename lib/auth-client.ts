import { createAuthClient } from "better-auth/react"
import type { BetterAuthClientPlugin } from "better-auth"

/**
 * Type-inference-only plugin (no runtime behavior): mirrors the
 * `user.additionalFields.role` schema from `lib/auth.ts` so the client
 * knows about `role` in `signUp` payloads and on `user` in sessions.
 *
 * Keep in sync with `lib/auth.ts`.
 */
const userRoleInference = {
    id: "hireloop-user-role-inference",
    $InferServerPlugin: {
        schema: {
            user: {
                fields: {
                    role: {
                        type: ["seeker", "recruiter", "admin"],
                        input: true,
                        required: false,
                        defaultValue: "seeker",
                    },
                },
            },
        },
    },
} satisfies BetterAuthClientPlugin

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [userRoleInference],
})

export const { signIn, signUp, signOut, useSession } = authClient
