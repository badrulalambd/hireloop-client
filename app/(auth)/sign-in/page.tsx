"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import PasswordField from "@/components/auth/PasswordField"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

type SignInValues = {
    email: string
    password: string
}

const initialValues: SignInValues = {
    email: "",
    password: "",
}

const SignInPage = () => {
    const [values, setValues] = useState<SignInValues>(initialValues)
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const updateField = (field: keyof SignInValues) => (value: string) =>
        setValues((current) => ({ ...current, [field]: value }))

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError(null)

        const { error: authError } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            rememberMe: remember,
            callbackURL: "/",
        })

        if (authError) {
            setError(authError.message || "Invalid email or password.")
            return
        }

        // better-auth set the session cookie on success — go home and
        // refresh so the app picks up the new session.
        router.push("/")
        router.refresh()
    }

    return (
        <Card className="shadow-[0_18px_60px_-24px_rgba(15,23,42,0.45)] ring-foreground/10 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-xl">Welcome back</CardTitle>
                <CardDescription>Sign in to continue to HireLoop.</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            required
                            value={values.email}
                            onChange={(event) => updateField("email")(event.target.value)}
                            className="h-9"
                        />
                    </div>

                    <PasswordField
                        id="password"
                        name="password"
                        label="Password"
                        autoComplete="current-password"
                        placeholder="Your password"
                        value={values.password}
                        onChange={updateField("password")}
                    />

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            checked={remember}
                            onCheckedChange={(checked) => setRemember(Boolean(checked))}
                        />
                        <Label htmlFor="remember" className="text-muted-foreground">
                            Remember me
                        </Label>
                    </div>

                    {error ? (
                        <p role="alert" className="text-sm text-destructive">
                            {error}
                        </p>
                    ) : null}

                    <button
                        type="submit"
                        className="h-9 w-full bg-indigo-500 text-white hover:bg-indigo-400"
                    >
                        Sign in
                    </button>
                </form>
            </CardContent>

            <CardFooter className="justify-center gap-1.5 bg-transparent text-muted-foreground">
                <span>Don&apos;t have an account?</span>
                <Link
                    href="/sign-up"
                    className="font-medium text-indigo-500 transition-colors hover:text-indigo-400"
                >
                    Sign up
                </Link>
            </CardFooter>
        </Card>
    )
}

export default SignInPage
