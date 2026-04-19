export const sportIcons = {
  Running: 'bi-person-walking',
  Cycling: 'bi-bicycle',
  Swimming: 'bi-water',
  Gym: 'bi-trophy',
  Walking: 'bi-person',
  Other: 'bi-activity',
};

export const sportColors = {
  Running: '#00C896',
  Cycling: '#58a6ff',
  Swimming: '#a371f7',
  Gym: '#FF5733',
  Walking: '#ffc107',
  Other: '#8b949e',
};

export const caloriesPerMinute = {
  Running: 10,
  Cycling: 8,
  Swimming: 9,
  Gym: 6,
  Walking: 4,
  Other: 5,
};

export const mockActivities = [
  { id: 1, type: 'Running', duration: 45, distance: 7.5, calories: 450, date: '2025-04-15', notes: 'Morning run in the park', weather: '18°C, Clear' },
  { id: 2, type: 'Cycling', duration: 60, distance: 22, calories: 480, date: '2025-04-13', notes: '', weather: '15°C, Partly cloudy' },
  { id: 3, type: 'Gym', duration: 50, distance: 0, calories: 300, date: '2025-04-11', notes: 'Leg day', weather: 'N/A' },
  { id: 4, type: 'Swimming', duration: 40, distance: 1.5, calories: 360, date: '2025-04-09', notes: 'Easy swim', weather: 'N/A' },
  { id: 5, type: 'Running', duration: 30, distance: 5, calories: 300, date: '2025-04-07', notes: '', weather: '20°C, Sunny' },
];

export const mockWeeklyData = [
  { day: 'Mon', calories: 450 },
  { day: 'Tue', calories: 0 },
  { day: 'Wed', calories: 300 },
  { day: 'Thu', calories: 480 },
  { day: 'Fri', calories: 0 },
  { day: 'Sat', calories: 360 },
  { day: 'Sun', calories: 300 },
];

export const mockMonthlyData = [
  { month: 'Nov', km: 42 },
  { month: 'Dec', km: 38 },
  { month: 'Jan', km: 55 },
  { month: 'Feb', km: 61 },
  { month: 'Mar', km: 70 },
  { month: 'Apr', km: 36 },
];

export const mockFriends = [
  { id: 2, name: 'Marie Dupont', avatar: 'MD', level: 'Advanced', status: 'friend', lastActivity: 'Running – 10km', lastDate: '2 days ago' },
  { id: 3, name: 'Thomas Leroy', avatar: 'TL', level: 'Intermediate', status: 'friend', lastActivity: 'Cycling – 35km', lastDate: 'Yesterday' },
  { id: 4, name: 'Sophie Bernard', avatar: 'SB', level: 'Beginner', status: 'pending', lastActivity: 'Walking – 3km', lastDate: '3 days ago' },
];

export const mockChallenges = [
  {
    id: 1,
    title: 'Run 100km in April',
    type: 'Running',
    metric: 'distance',
    goal: 100,
    current: 36,
    unit: 'km',
    participants: 8,
    joined: true,
    endDate: '2025-04-30',
    leaderboard: [
      { rank: 1, name: 'Marie Dupont', avatar: 'MD', value: 72 },
      { rank: 2, name: 'Alex Martin', avatar: 'AM', value: 36 },
      { rank: 3, name: 'Thomas Leroy', avatar: 'TL', value: 28 },
    ],
  },
  {
    id: 2,
    title: 'Cycle 500km this month',
    type: 'Cycling',
    metric: 'distance',
    goal: 500,
    current: 0,
    unit: 'km',
    participants: 5,
    joined: false,
    endDate: '2025-04-30',
    leaderboard: [
      { rank: 1, name: 'Sophie Bernard', avatar: 'SB', value: 210 },
    ],
  },
  {
    id: 3,
    title: 'Burn 10 000 kcal in a week',
    type: 'Gym',
    metric: 'calories',
    goal: 10000,
    current: 0,
    unit: 'kcal',
    participants: 12,
    joined: false,
    endDate: '2025-04-21',
    leaderboard: [],
  },
];
