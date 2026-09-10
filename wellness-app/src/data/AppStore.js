import React, { createContext, useContext, useState } from "react";
import {
  initialGroups,
  initialCheckIns,
  initialPersonalGoals,
  initialPersonalCheckIns,
  initialChatMessages,
  initialExploreGoals,
  currentUser,
} from "./mockData";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

// The single canonical "this week" boundary (Monday 00:00 through the
// following Sunday). progressThisWeek and the leaderboard both mean the
// same week — this is that definition, so nothing else should compute
// its own.
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday ... 6 = Saturday
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

function isThisWeek(dateString) {
  return new Date(dateString) >= getWeekStart();
}

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [groups, setGroups] = useState(initialGroups);
  const [checkIns, setCheckIns] = useState(initialCheckIns);
  const [personalGoals, setPersonalGoals] = useState(initialPersonalGoals);
  const [personalCheckIns, setPersonalCheckIns] = useState(initialPersonalCheckIns);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  // Tracks how many messages in each group the user has actually seen,
  // so the chat list can show an unread badge for the rest.
  const [readCounts, setReadCounts] = useState({});
  // The public Explore feed — mock "other user" posts for now. Local/
  // mock only: nothing here syncs across devices yet.
  const [exploreGoals, setExploreGoals] = useState(initialExploreGoals);

  // Appends a message to a group's thread and marks it read for the
  // sender (everything here is authored by the current user for now).
  function pushMessage(groupId, message) {
    const newMessage = {
      id: `m_${Date.now()}_${Math.round(Math.random() * 1000)}`,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      ...message,
    };
    setChatMessages((prev) => {
      const updated = { ...prev, [groupId]: [...(prev[groupId] || []), newMessage] };
      setReadCounts((prevRead) => ({ ...prevRead, [groupId]: updated[groupId].length }));
      return updated;
    });
  }

  function addGoalToGroup(groupId, title, targetPerWeek, sharedToExplore = false) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              goals: [
                ...g.goals,
                {
                  id: `goal_${Date.now()}`,
                  title,
                  cadence: "daily",
                  targetPerWeek,
                  progressThisWeek: 0,
                  sharedToExplore,
                },
              ],
            }
          : g
      )
    );
  }

  function submitCheckIn(goalId, groupId, groupName, goalTitle, note, status) {
    const newCheckIn = {
      id: `c_${Date.now()}`,
      goalId,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toISOString().slice(0, 10),
      note,
      status,
    };
    setCheckIns((prev) => [newCheckIn, ...prev]);

    // bump progress on the goal if it was completed
    if (status === "done") {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? {
                ...g,
                goals: g.goals.map((goal) =>
                  goal.id === goalId
                    ? {
                        ...goal,
                        progressThisWeek: Math.min(
                          goal.progressThisWeek + 1,
                          goal.targetPerWeek
                        ),
                      }
                    : goal
                ),
              }
            : g
        )
      );
    }

    // Post the check-in into the group's chat thread so accountability
    // shows up where the group is already spending time.
    pushMessage(groupId, {
      type: "system",
      status,
      userName: currentUser.name,
      text:
        status === "done"
          ? `${currentUser.name} checked in: ${goalTitle} ✅`
          : `${currentUser.name} missed today's goal: ${goalTitle} (no shame, tomorrow's a reset)`,
    });
  }

  // Posts the proof-of-completion photo a user takes right after
  // checking off a group goal.
  function sendGoalPhoto(groupId, imageUri, goalTitle) {
    pushMessage(groupId, {
      type: "photo",
      userId: currentUser.id,
      userName: currentUser.name,
      imageUri,
      caption: goalTitle ? `Proof: ${goalTitle}` : null,
    });
  }

  function addPersonalGoal(title, targetPerWeek, sharedToExplore = false) {
    setPersonalGoals((prev) => [
      ...prev,
      {
        id: `pg_${Date.now()}`,
        title,
        targetPerWeek,
        progressThisWeek: 0,
        sharedToExplore,
      },
    ]);
  }

  function submitPersonalCheckIn(goalId, note, status) {
    const newCheckIn = {
      id: `pc_${Date.now()}`,
      goalId,
      date: todayString(),
      note,
      status,
    };
    setPersonalCheckIns((prev) => [newCheckIn, ...prev]);

    if (status === "done") {
      setPersonalGoals((prev) =>
        prev.map((goal) =>
          goal.id === goalId
            ? {
                ...goal,
                progressThisWeek: Math.min(
                  goal.progressThisWeek + 1,
                  goal.targetPerWeek
                ),
              }
            : goal
        )
      );
    }
  }

  function sendMessage(groupId, text) {
    pushMessage(groupId, {
      type: "text",
      userId: currentUser.id,
      userName: currentUser.name,
      text,
    });
  }

  // Call when a thread is opened so its unread badge clears.
  function markGroupRead(groupId) {
    setReadCounts((prev) => ({
      ...prev,
      [groupId]: (chatMessages[groupId] || []).length,
    }));
  }

  // Ranks a group's members by completed check-ins this week. Members
  // with zero misses this week rank above anyone with at least one miss;
  // within each of those tiers, higher completed count ranks higher. A
  // miss only pushes someone down a tier — it never drops them off the list.
  function getLeaderboard(groupId) {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return [];

    const goalIds = group.goals.map((g) => g.id);

    const standings = group.members.map((member) => {
      const memberCheckIns = checkIns.filter(
        (c) =>
          c.userId === member.id &&
          goalIds.includes(c.goalId) &&
          isThisWeek(c.date)
      );
      const completed = memberCheckIns.filter((c) => c.status === "done").length;
      const missed = memberCheckIns.filter((c) => c.status === "missed").length;
      return {
        userId: member.id,
        name: member.name,
        completed,
        missed,
        // A simple "hot streak" read on the week so far: several clean
        // check-ins and nothing missed yet.
        isOnStreak: missed === 0 && completed >= 3,
      };
    });

    return standings.sort((a, b) => {
      const aPerfect = a.missed === 0;
      const bPerfect = b.missed === 0;
      if (aPerfect !== bPerfect) return aPerfect ? -1 : 1;
      return b.completed - a.completed;
    });
  }

  // --- Explore feed ---
  // Mock/local only for now: no cross-device sync, no comment
  // moderation, and "save" is just a bookmark — it does not create a
  // real tracked goal. All Phase 2, once there's a real backend.

  function likeExploreGoal(postId) {
    setExploreGoals((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likedByMe: !post.likedByMe,
              likeCount: post.likeCount + (post.likedByMe ? -1 : 1),
            }
          : post
      )
    );
  }

  function saveExploreGoal(postId) {
    setExploreGoals((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              savedByMe: !post.savedByMe,
              saveCount: post.saveCount + (post.savedByMe ? -1 : 1),
            }
          : post
      )
    );
  }

  function addExploreComment(postId, text) {
    const trimmed = text.trim();
    if (trimmed.length === 0) return;
    const newComment = {
      id: `exc_${Date.now()}`,
      authorName: currentUser.name,
      text: trimmed,
    };
    setExploreGoals((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  }

  // Reposts a post to the top of the Explore feed under the current
  // user's own presence, crediting the original anonymous poster.
  function echoExploreGoal(postId) {
    const original = exploreGoals.find((post) => post.id === postId);
    if (!original) return;

    setExploreGoals((prev) => {
      const bumped = prev.map((post) =>
        post.id === postId ? { ...post, echoCount: post.echoCount + 1 } : post
      );
      const echoPost = {
        id: `ex_echo_${Date.now()}`,
        anonName: currentUser.name,
        title: original.title,
        category: original.category,
        likeCount: 0,
        saveCount: 0,
        echoCount: 0,
        likedByMe: false,
        savedByMe: false,
        isEcho: true,
        echoedFromName: original.anonName,
        comments: [],
      };
      return [echoPost, ...bumped];
    });
  }

  function getSavedExploreGoals() {
    return exploreGoals.filter((post) => post.savedByMe);
  }

  // Builds today's outstanding task list across every group goal and
  // personal goal the user hasn't already checked into today.
  function getTodaysTasks() {
    const today = todayString();

    const groupTasks = groups.flatMap((g) =>
      g.goals
        .filter(
          (goal) =>
            !checkIns.some(
              (c) => c.goalId === goal.id && c.date === today
            )
        )
        .map((goal) => ({
          kind: "group",
          goalId: goal.id,
          groupId: g.id,
          groupName: g.name,
          title: goal.title,
        }))
    );

    const personalTasks = personalGoals
      .filter(
        (goal) =>
          !personalCheckIns.some(
            (c) => c.goalId === goal.id && c.date === today
          )
      )
      .map((goal) => ({
        kind: "personal",
        goalId: goal.id,
        title: goal.title,
      }));

    return [...groupTasks, ...personalTasks];
  }

  const value = {
    currentUser,
    groups,
    checkIns,
    personalGoals,
    personalCheckIns,
    chatMessages,
    readCounts,
    exploreGoals,
    addGoalToGroup,
    submitCheckIn,
    addPersonalGoal,
    submitPersonalCheckIn,
    sendMessage,
    sendGoalPhoto,
    markGroupRead,
    getTodaysTasks,
    getLeaderboard,
    likeExploreGoal,
    saveExploreGoal,
    addExploreComment,
    echoExploreGoal,
    getSavedExploreGoals,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used inside AppStoreProvider");
  }
  return ctx;
}
