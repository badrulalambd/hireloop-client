"use client"

import { useState, type FormEvent, type ReactNode } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Briefcase, Search, ShieldCheck } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type Role = "seeker" | "recruiter" | "admin"

type RoleOption = {
    value: Role
    label: string
    description: string
    icon: ReactNode
}

const roles: RoleOption[] = [
    {
        value: "seeker",
        label: "Job Seeker",
        description: "Search and apply for jobs",
        icon: <Search className="size-3.5" />,
    },
    {
        value: "recruiter",
        label: "Recruiter",
        description: "Post jobs and hire talent",
        icon: <Briefcase className="size-3.5" />,
    },
    {
        value: "admin",
        label: "Admin",
        description: "Manage the platform",
        icon: <ShieldCheck className="size-3.5" />,
    },
]

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
    const [role, setRole] = useState<Role>("seeker")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const updateField = (field: keyof SignUpValues) => (value: string) =>
        setValues((current) => ({ ...current, [field]: value }))

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (values.password !== values.confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setError(null)

        const { error: authError } = await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
            role,
            callbackURL: "/sign-in",
        })

        if (authError) {
            setError(
                authError.message || "Something went wrong. Please try again.",
            )
            return
        }

        // Sign-up does not create a session (autoSignIn: false), so the
        // user has to log in — send them to the sign-in page.
        router.push("/sign-in")
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

                    <div className="flex flex-col gap-2">
                        <span id="role-label" className="text-sm font-medium">
                            Sign up as
                        </span>
                        <RadioGroup
                            value={role}
                            onValueChange={(value) => setRole(value as Role)}
                            name="role"
                            aria-labelledby="role-label"
                            className="grid gap-2"
                        >
                            {roles.map((option) => {
                                const selected = option.value === role

                                return (
                                    <Label
                                        key={option.value}
                                        className={cn(
                                            "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 leading-normal transition-colors",
                                            "has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                                            selected
                                                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                                                : "border-input hover:bg-muted/60 dark:bg-input/20",
                                        )}
                                    >
                                        <RadioGroupItem
                                            value={option.value}
                                            className="shrink-0"
                                        />
                                        <span className="flex min-w-0 flex-1 flex-col">
                                            <span className="flex items-center gap-1.5 text-sm font-medium">
                                                <span className="text-indigo-500 dark:text-indigo-400">
                                                    {option.icon}
                                                </span>
                                                {option.label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {option.description}
                                            </span>
                                        </span>
                                    </Label>
                                )
                            })}
                        </RadioGroup>
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
