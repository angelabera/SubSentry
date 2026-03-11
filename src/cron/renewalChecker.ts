import cron from "node-cron";

let isScheduled = false;

export function startRenewalChecker() {
  if (isScheduled) return;
  isScheduled = true;

  // Run every day at 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/cron/check-renewals`, {
        method: "POST",
      });
      const data = await response.json();
      console.log("[SubSentry Cron]", data.message || data.error);
    } catch (error) {
      console.error("[SubSentry Cron] Failed to check renewals:", error);
    }
  });

  console.log("[SubSentry Cron] Renewal checker scheduled - runs daily at 8:00 AM");
}
