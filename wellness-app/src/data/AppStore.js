import React, { createContext, useContext, useState } from "react";
import {
  initialGroups,
  initialCheckIns,
  initialFeed,
  initialPersonalGoals,
  initialPersonalCheckIns,
  initialChatMessages,
  currentUser,
} from "./mockData";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

const AppStoreContext = createContext(null);

export function AppStoreProvider({ children }) {
  const [groups, setGroups] = useState(initialGroups);
  const [checkIns, setCheckIns] = useState(initialCheckIns);
  const [feed, setFeed] = useState(initialFeed);
  const [personalGoals, setPersonalGoals] = useState(initialPersonalGoals);
  const [personalCheckIns, setPersonalCheckIns] = useState(initialPersonalCheckIns);
  const [chatMessages, setChatMessages] = useState(initialChatMessages);

  function addGoalToGroup(groupId, title, targetPerWeek) {
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

    // post to the shared feed so the group sees accountability in action
    setFeed((prev) => [
      {
        id: `f_${Date.now()}`,
        userName: currentUser.name,
        groupName,
        text:
          status === "done"
            ? `Checked in: ${goalTitle}`
            : `Missed today's goal: ${goalTitle} (no shame, tomorrow's a reset)`,
        kind: status === "done" ? "checkin" : "miss",
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  }

  function addPersonalGoal(title, targetPerWeek) {
    setPersonalGoals((prev) => [
      ...prev,
      {
        id: `pg_${Date.now()}`,
        title,
        targetPerWeek,
        progressThisWeek: 0,
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
    const newMessage = {
      id: `m_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      text,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setChatMessages((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), newMessage],
    }));
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
    feed,
    personalGoals,
    personalCheckIns,
    chatMessages,
    addGoalToGroup,
    submitCheckIn,
    addPersonalGoal,
    submitPersonalCheckIn,
    sendMessage,
    getTodaysTasks,
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
