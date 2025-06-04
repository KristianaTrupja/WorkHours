export const normalizeProjectKey = (key: string) => {
    if (key.startsWith("PID-")) {
      return "project-" + key.split("-")[1];
    }
    return key;
  };
  