import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../../lib/auth'
import { useAuth } from '../../contexts/AuthContext'

export function Auth() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    // Redirect to calendar if user is already authenticated
    useEffect(() => {
        if (user) {
            navigate('/calendar', { replace: true })
        }
    }, [user, navigate])

    // Password validation checks
    const passwordChecks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
    }

    const isPasswordValid = Object.values(passwordChecks).every(check => check)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            setLoading(true)
            setMessage('')

            if (isSignUp) {
                await signUp(email, password)
                setMessage('Check your email to confirm your account!')
            } else {
                await signIn(email, password)
                setMessage('Successfully signed in!')
            }
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen min-w-full bg-background p-4">
            <div className="bg-card border border-border p-8 rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        P&L Calendar
                    </h1>
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-input rounded-md text-base bg-background text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must contain at least one number, one uppercase and lowercase letter, and be at least 8 characters"
                            className="w-full p-3 border border-input rounded-md text-base bg-background text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />

                        {/* Password Requirements - Only show when signing up and typing */}
                        {isSignUp && password.length > 0 && (
                            <div className="mt-2 p-3 bg-muted rounded-md text-xs">
                                <div className="font-semibold mb-2 text-foreground">
                                    Password Requirements:
                                </div>
                                <div className="flex flex-col gap-1">
                                    <PasswordRequirement 
                                        met={passwordChecks.length} 
                                        text="At least 8 characters" 
                                    />
                                    <PasswordRequirement 
                                        met={passwordChecks.lowercase} 
                                        text="One lowercase letter" 
                                    />
                                    <PasswordRequirement 
                                        met={passwordChecks.uppercase} 
                                        text="One uppercase letter" 
                                    />
                                    <PasswordRequirement 
                                        met={passwordChecks.number} 
                                        text="One number" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || (isSignUp && !isPasswordValid)}
                        className="w-full p-3 bg-primary text-primary-foreground border-none rounded-md text-base font-semibold cursor-pointer transition-colors mt-2 hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
                    >
                        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <div className={`mt-4 p-3 rounded-md text-sm border ${
                        message.includes('error') || message.includes('Error')
                            ? 'bg-destructive/10 border-destructive/20 text-destructive'
                            : 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
                    }`}>
                        {message}
                    </div>
                )}

                {/* Toggle Button */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            setMessage('')
                        }}
                        type="button"
                        className="bg-transparent border-none text-primary text-sm cursor-pointer underline p-0 hover:text-primary/80 transition-colors"
                    >
                        {isSignUp
                            ? 'Already have an account? Sign In'
                            : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Helper component for password requirements
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
    return (
        <div className={`flex items-center gap-2 ${met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
            <span className="text-base">
                {met ? '✓' : '○'}
            </span>
            <span>{text}</span>
        </div>
    )
}
