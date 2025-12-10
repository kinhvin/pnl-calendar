import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            minWidth: '100vw',
            backgroundColor: '#f9fafb',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.10),  0 -3px 8px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '400px'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '1.875rem',
                        fontWeight: '700',
                        color: '#111827',
                        marginBottom: '0.5rem'
                    }}>
                        P&L Calendar
                    </h1>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#374151'
                    }}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Email Input */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                backgroundColor: '#ffffff',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '0.5rem'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"  // Require: number, lowercase, uppercase
                            title="Must contain at least one number, one uppercase and lowercase letter, and be at least 8 characters"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                backgroundColor: '#ffffff',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                        />

                        {/* Password Requirements - Only show when signing up and typing */}
                        {isSignUp && password.length > 0 && (
                            <div style={{
                                marginTop: '0.5rem',
                                padding: '0.75rem',
                                backgroundColor: '#f9fafb',
                                borderRadius: '0.375rem',
                                fontSize: '0.75rem'
                            }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                    Password Requirements:
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: loading || (isSignUp && !isPasswordValid) ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.375rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading || (isSignUp && !isPasswordValid) ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                            marginTop: '0.5rem'
                        }}
                        onMouseOver={(e) => {
                            if (!loading && !(isSignUp && !isPasswordValid)) 
                                e.currentTarget.style.backgroundColor = '#2563eb'
                        }}
                        onMouseOut={(e) => {
                            if (!loading && !(isSignUp && !isPasswordValid)) 
                                e.currentTarget.style.backgroundColor = '#3b82f6'
                        }}
                    >
                        {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: message.includes('error') || message.includes('Error') ? '#fee2e2' : '#dcfce7',
                        border: `1px solid ${message.includes('error') || message.includes('Error') ? '#fecaca' : '#bbf7d0'}`,
                        color: message.includes('error') || message.includes('Error') ? '#991b1b' : '#166534',
                        fontSize: '0.875rem'
                    }}>
                        {message}
                    </div>
                )}

                {/* Toggle Button */}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            setMessage('')
                        }}
                        type="button"
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#3b82f6',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#3b82f6'}
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
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: met ? '#16a34a' : '#6b7280'
        }}>
            <span style={{ fontSize: '1rem' }}>
                {met ? '✓' : '○'}
            </span>
            <span>{text}</span>
        </div>
    )
}