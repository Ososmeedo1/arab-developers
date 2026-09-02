import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getChannelClickStats } from "@/lib/channel-clicks";

export async function GET(request) {
  try {
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return Response.json({
        error: "Unauthorized"
      }, { status: 401 });
    }

    const stats = await getChannelClickStats();

    return Response.json({
      totalClicks: stats.totalClicks,
      lastClick: stats.lastClick ? stats.lastClick.toISOString() : null
    });
  } catch (error) {
    console.error("Failed to get channel click stats:", error);
    return Response.json({
      error: "Failed to retrieve statistics"
    }, { status: 500 });
  }
}
