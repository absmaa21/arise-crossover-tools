export function toHumanReadable(input: string): string {
  const specialCases: Record<string, string> = {
    rbxName: "Roblox Name",
    discord: "Discord Name",
    gemChecks: "Total Gems"
  };

  return specialCases[input] || (
    input
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
}