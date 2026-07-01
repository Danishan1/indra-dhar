export const saveAuth = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export const getAuth = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");
  return { user, token };
};

export const clearAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
