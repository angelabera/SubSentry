export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startRenewalChecker } = await import("./cron/renewalChecker");
    startRenewalChecker();
  }
}
