import { supabase } from '../lib/supabase';

/* 
* Fetches all PnL entries for a specific user
*/
export async function fetchPNLEntries(id: string) {
    const { data, error } = await supabase
        .from('pnl_entries')
        .select('*')
        .eq('id', id)
        .order('date', { ascending: false });

    if (error) throw error;
    return data;
}

/* 
* Fetches PnL entries for a specific month
*/
export async function fetchPNLEntriesByMonth(
    userId: string,
    year: number,
    month: number
) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    // Get the last day of the month by creating a date with the next month and day 0
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const { data, error } = await supabase
        .from('pnl_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

    if (error) throw error;
    return data;
}

/* 
* Creates a new PNL entry
*/
export async function createPNLEntry(
    userId: string,
    date: string,
    pnl: number,
    trades?: number
) {
    const { data, error } = await supabase
        .from('pnl_entries')
        .insert({
            user_id: userId,
            date,
            pnl,
            trades,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/* 
* Updates an existing PNL entry
*/
export async function updatePNLEntry(
    entryId: string,
    updates: { pnl?: number; trades?: number }
) {
    const { data, error } = await supabase
        .from('pnl_entries')
        .update(updates)
        .eq('id', entryId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/* 
* Deletes a PNL entry
*/
export async function deletePNLEntry(entryId: string) {
    const { error } = await supabase
        .from('pnl_entries')
        .delete()
        .eq('id', entryId);

    if (error) throw error;
}

/* 
* Calculates monthly statistics from entries
*/
export function calculateMonthlyStats(entries: any[]) {
    let totalPnL = 0;
    let winningDays = 0;
    let losingDays = 0;
    let totalTrades = 0;
    
    entries.forEach((entry) => {
        totalPnL += entry.pnl;
        if (entry.pnl > 0) winningDays++;
        if (entry.pnl < 0) losingDays++;
        totalTrades += entry.trades || 0;
    });

    return {
        totalPnL,
        winningDays,
        losingDays,
        totalTrades,
        tradingDays: winningDays + losingDays,
    };
}

/* 
* Fetches a monthly goal for a specific user, year, and month
*/
export async function fetchMonthlyGoal(
    userId: string,
    year: number,
    month: number
) {
    const { data, error } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .eq('month', month)
        .maybeSingle();

    if (error) throw error;
    return data;
}

/* 
* Fetches all monthly goals for a specific user
*/
export async function fetchAllMonthlyGoals(userId: string) {
    const { data, error } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('user_id', userId)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

    if (error) throw error;
    return data || [];
}

/* 
* Creates or updates a monthly goal
*/
export async function upsertMonthlyGoal(
    userId: string,
    year: number,
    month: number,
    goal: number
) {
    // First check if a goal exists
    const existing = await fetchMonthlyGoal(userId, year, month);
    
    if (existing) {
        // Update existing goal
        const { data, error } = await supabase
            .from('monthly_goals')
            .update({ goal })
            .eq('id', existing.id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    } else {
        // Create new goal
        const { data, error } = await supabase
            .from('monthly_goals')
            .insert({
                user_id: userId,
                year,
                month,
                goal,
            })
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
}

/* 
* Deletes a monthly goal
*/
export async function deleteMonthlyGoal(
    userId: string,
    year: number,
    month: number
) {
    const { error } = await supabase
        .from('monthly_goals')
        .delete()
        .eq('user_id', userId)
        .eq('year', year)
        .eq('month', month);

    if (error) throw error;
}