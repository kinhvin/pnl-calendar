import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchPNLEntriesByMonth } from '../services/calendarService';
import type { DayData } from '../types/calendar';

/* 
* Hook that manages calendar data for a specific month
*/
export function useCalendarData(year: number, month: number) {
    const { user } = useAuth();
    const [data, setData] = useState<Record<string, DayData>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        async function loadData() {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);
                
                const entries = await fetchPNLEntriesByMonth(user.id, year, month);
                
                // Transform entries into date-keyed object
                const entriesMap: Record<string, DayData> = {};
                entries.forEach((entry: any) => {
                    entriesMap[entry.date] = {
                        id: entry.id,
                        date: new Date(entry.date).getDate(),
                        pnl: entry.pnl,
                        trades: entry.trades,
                    };
                });

                setData(entriesMap);
            }

            catch (err: any) {
                setError(err.message);
                console.error('Error loading calendar data:', err);
            } 

            finally {
                setLoading(false);
            }
        }
        loadData();
    }, [user, year, month]);

    return { data, setData, loading, error };
}