export const getMessage = async (question) => {
  const result = await fetch("api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ question }),
  });
  return result;
};
