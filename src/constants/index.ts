export const NAVIGATION_LINKS = {
  home: "/",
  login: "/login",
  register: "/register",
  userSettings: "/user-settings",
} as const;

export const SESSION_COOKIE = "session";
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
