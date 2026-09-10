// This file is temporary stand-in data.
// When you wire up Supabase (see README "Next Steps"), you'll replace
// these arrays with real queries, but every screen already reads from
// the shared store below, so swapping the source later is a small change.

export const currentUser = {
  id: "u1",
  name: "You",
  avatarColor: "#22D3AA",
};

export const initialGroups = [
  {
    id: "g1",
    name: "Morning Movers",
    members: [
      { id: "u1", name: "You" },
      { id: "u2", name: "Alex" },
      { id: "u3", name: "Priya" },
    ],
    goals: [
      {
        id: "goal1",
        title: "Walk 20 min every morning",
        cadence: "daily",
        targetPerWeek: 7,
        progressThisWeek: 4,
      },
      {
        id: "goal2",
        title: "No phone before 8am",
        cadence: "daily",
        targetPerWeek: 7,
        progressThisWeek: 5,
      },
    ],
  },
  {
    id: "g2",
    name: "Hydration Nation",
    members: [
      { id: "u1", name: "You" },
      { id: "u4", name: "Sam" },
    ],
    goals: [
      {
        id: "goal3",
        title: "Drink 8 glasses of water",
        cadence: "daily",
        targetPerWeek: 7,
        progressThisWeek: 6,
      },
    ],
  },
];

export const initialCheckIns = [
  {
    id: "c1",
    goalId: "goal1",
    userId: "u1",
    userName: "You",
    date: "2026-08-29",
    note: "Walked to the park and back, felt great.",
    status: "done",
  },
  {
    id: "c2",
    goalId: "goal2",
    userId: "u2",
    userName: "Alex",
    date: "2026-08-29",
    note: "Slipped up, checked email at 7am. Tomorrow's a new day.",
    status: "missed",
  },
];

export const initialPersonalGoals = [
  {
    id: "pg1",
    title: "Read 10 pages",
    targetPerWeek: 7,
    progressThisWeek: 3,
  },
  {
    id: "pg2",
    title: "Stretch before bed",
    targetPerWeek: 5,
    progressThisWeek: 2,
  },
];

export const initialPersonalCheckIns = [];

export const initialChatMessages = {
  g1: [
    {
      id: "m1",
      userId: "u2",
      userName: "Alex",
      text: "Morning walk crew, who's up early tomorrow?",
      time: "8:02 AM",
    },
    {
      id: "m2",
      userId: "u3",
      userName: "Priya",
      text: "Me! 6am at the usual spot",
      time: "8:05 AM",
    },
  ],
  g2: [
    {
      id: "m3",
      userId: "u4",
      userName: "Sam",
      text: "Reminder to refill your water bottles tonight 💧",
      time: "9:14 PM",
    },
  ],
};
