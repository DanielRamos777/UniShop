export const sendSimulatedEmail = ({ to, subject, body }) => {
  if (!to) return false;
  const record = {
    to,
    subject,
    body,
    date: new Date().toISOString(),
  };
  console.log("[email]", record);
  try {
    const stored = JSON.parse(localStorage.getItem("sentEmails") || "[]");
    stored.push(record);
    localStorage.setItem("sentEmails", JSON.stringify(stored));
  } catch (error) {
    console.warn("No se pudo guardar el correo simulado", error);
  }
  return true;
};
