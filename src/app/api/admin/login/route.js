import { verifyAdminPassword, createAdminSession } from "@/lib/admin-auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return Response.json({
        success: false,
        error: "Password is required"
      }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return Response.json({
        success: false,
        error: "Invalid password"
      }, { status: 401 });
    }

    // Create session
    await createAdminSession();

    return Response.json({
      success: true,
      message: "Admin session created"
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return Response.json({
      success: false,
      error: "Authentication failed"
    }, { status: 500 });
  }
}
