"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

import PasswordField from "@/components/auth/PasswordField"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

type SignUpValues = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const initialValues: SignUpValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
}

const SignUpPage = () => {
    const [values, setValues] = useState<SignUpValues>(initialValues)
    const [error, setError] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)

    const updateField = (field: keyof SignUpValues) => (value: string) =>
        setValues((current) => ({ ...current, [field]: value }))

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (values.password !== values.confirmPassword) {
            setStatus(null)
            setError("Passwords do not match.")
            return
        }

        setError(null)

        // TODO: wire up better-auth sign-up once the backend is ready.
        console.log("[sign-up] received form data:", values)

        const { data, error } = await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
            callbackURL: "/"
        });

        setStatus("Form data received — authentication will be connected soon.")
    }

    return (
        <Card className="shadow-[0_18px_60px_-24px_rgba(15,23,42,0.45)] ring-foreground/10 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-xl">Create your account</CardTitle>
                <CardDescription>
                    Join HireLoop and start discovering your dream job.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Full name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Ada Lovelace"
                            required
                            value={values.name}
                            onChange={(event) => updateField("name")(event.target.value)}
                            className="h-9"
                        />
                    </div>

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
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        minLength={8}
                        value={values.password}
                        onChange={updateField("password")}
                    />

                    <PasswordField
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm password"
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        minLength={8}
                        value={values.confirmPassword}
                        onChange={updateField("confirmPassword")}
                    />

                    {error ? (
                        <p role="alert" className="text-sm text-destructive">
                            {error}
                        </p>
                    ) : null}

                    <Button
                        type="submit"
                        className="h-9 w-full bg-indigo-500 text-white hover:bg-indigo-400"
                    >
                        Create account
                    </Button>

                    {status ? (
                        <p
                            role="status"
                            className="text-center text-sm text-muted-foreground"
                        >
                            {status}
                        </p>
                    ) : null}
                </form>
            </CardContent>

            <CardFooter className="justify-center gap-1.5 bg-transparent text-muted-foreground">
                <span>Already have an account?</span>
                <Link
                    href="/sign-in"
                    className="font-medium text-indigo-500 transition-colors hover:text-indigo-400"
                >
                    Sign in
                </Link>
            </CardFooter>
        </Card>
    )
}

export default SignUpPage
