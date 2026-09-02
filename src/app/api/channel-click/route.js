import { getOrCreateAnonymousId } from "@/lib/cookie";
import { recordChannelClick, ensureChannelClicksIndexes } from "@/lib/channel-clicks";

export async function POST(request) {
  try {
    // Ensure indexes exist
    await ensureChannelClicksIndexes();

    // Get or create anonymous ID
    const { id: anonymousId } = await getOrCreateAnonymousId();

    // Record the click
    const result = await recordChannelClick(anonymousId);

    return Response.json({
      success: true,
      recorded: result.recorded,
      reason: result.reason || "success"
    });
  } catch (error) {
    console.error("Failed to record channel click:", error);

    // Still return success so navigation isn't blocked
    return Response.json({
      success: false,
      error: "Failed to record click"
    }, { status: 500 });
  }
}
