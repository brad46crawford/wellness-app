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
        sharedToExplore: false,
      },
      {
        id: "goal2",
        title: "No phone before 8am",
        cadence: "daily",
        targetPerWeek: 7,
        progressThisWeek: 5,
        sharedToExplore: false,
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
        sharedToExplore: false,
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
    sharedToExplore: false,
  },
  {
    id: "pg2",
    title: "Stretch before bed",
    targetPerWeek: 5,
    progressThisWeek: 2,
    sharedToExplore: false,
  },
];

export const initialPersonalCheckIns = [];

// Fake "other user" posts for the Explore feed. Nobody real is behind
// these — anonymous handles stand in for real accounts until there's a
// backend with actual other users.
export const initialExploreGoals = [
  {
    id: "ex1",
    anonName: "Wanderer42",
    title: "Walk 10,000 steps every day",
    category: "Movement",
    likeCount: 34,
    saveCount: 8,
    likedByMe: false,
    savedByMe: false,
    comments: [
      { id: "exc1", authorName: "QuietPeak", text: "This got me off the couch, love it" },
    ],
  },
  {
    id: "ex2",
    anonName: "QuietPeak",
    title: "Meditate 10 minutes every morning",
    category: "Mindfulness",
    likeCount: 51,
    saveCount: 19,
    likedByMe: false,
    savedByMe: false,
    comments: [
      { id: "exc2", authorName: "DuskRunner", text: "Been doing this for 2 weeks, huge difference" },
      { id: "exc3", authorName: "MightyOtter", text: "What app/timer do you use?" },
    ],
  },
  {
    id: "ex3",
    anonName: "SteadyOak",
    title: "No sugar on weekdays",
    category: "Nutrition",
    likeCount: 22,
    saveCount: 6,
    likedByMe: false,
    savedByMe: false,
    comments: [],
  },
  {
    id: "ex4",
    anonName: "DuskRunner",
    title: "Couch to 5K in 8 weeks",
    category: "Movement",
    likeCount: 67,
    saveCount: 25,
    likedByMe: false,
    savedByMe: false,
    comments: [
      { id: "exc4", authorName: "Wanderer42", text: "Week 4 and still alive, thanks for the push" },
    ],
  },
  {
    id: "ex5",
    anonName: "MightyOtter",
    title: "Lights out by 10:30pm",
    category: "Sleep",
    likeCount: 18,
    saveCount: 9,
    likedByMe: false,
    savedByMe: false,
    comments: [],
  },
  {
    id: "ex6",
    anonName: "CalmTide",
    title: "Drink a full glass of water before coffee",
    category: "Hydration",
    likeCount: 29,
    saveCount: 11,
    likedByMe: false,
    savedByMe: false,
    comments: [],
  },
  {
    id: "ex7",
    anonName: "IronWillow",
    title: "Read 20 pages before bed",
    category: "Learning",
    likeCount: 41,
    saveCount: 14,
    likedByMe: false,
    savedByMe: false,
    comments: [
      { id: "exc5", authorName: "CalmTide", text: "Doing this instead of doomscrolling now" },
    ],
  },
  {
    id: "ex8",
    anonName: "NightHiker",
    title: "One phone-free meal a day",
    category: "Mindfulness",
    likeCount: 15,
    saveCount: 5,
    likedByMe: false,
    savedByMe: false,
    comments: [],
  },
];

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
