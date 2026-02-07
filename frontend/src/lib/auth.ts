import { supabase } from './supabase'

// Sign up a new user
export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ 
        email, 
        password, })
    if (error) throw error
    return data
}

// Sign in existing user
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password, })

    if (error) throw error
    return data
}

// Sign out current user
export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

// Get current user
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
}

// Reset password
export async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: '${window.location.origin}/update-password',
    })
    if (error) throw error
}