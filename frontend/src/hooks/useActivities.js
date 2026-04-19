import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { mockActivities } from '../services/mockData';

const USE_MOCK = false; // set to true to bypass backend during development

export function useActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        setActivities(mockActivities);
      } else {
        const data = await api.getActivities();
        setActivities(data);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (activity) => {
    if (USE_MOCK) {
      setActivities((prev) => [activity, ...prev]);
      return activity;
    }
    const saved = await api.createActivity(activity);
    setActivities((prev) => [saved, ...prev]);
    return saved;
  };

  const remove = async (id) => {
    if (!USE_MOCK) await api.deleteActivity(id);
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const stats = activities.reduce(
    (acc, a) => ({
      totalKm: acc.totalKm + (a.distance || 0),
      totalCalories: acc.totalCalories + (a.calories || 0),
      totalMinutes: acc.totalMinutes + (a.duration || 0),
      count: acc.count + 1,
    }),
    { totalKm: 0, totalCalories: 0, totalMinutes: 0, count: 0 }
  );

  return { activities, loading, error, stats, add, remove, refresh: load };
}
