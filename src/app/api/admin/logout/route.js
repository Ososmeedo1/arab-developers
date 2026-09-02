import { destroyAdminSession } from "@/lib/admin-auth";

export async function POST(request) {
  try {
    await destroyAdminSession();

    return Response.json({
      success: true,
      message: "Logged out"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({
      success: false,
      error: "Logout failed"
    }, { status: 500 });
  }
}
