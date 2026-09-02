import { NextResponse } from "next/server";
import { getAnonymousId } from "@/lib/cookie";
import { getResponsesCollection } from "@/lib/mongodb";
import { validateResponse, buildResponseDoc } from "@/lib/validation";

export async function GET() {
  try {
    const anonymousId = await getAnonymousId();
    if (!anonymousId) {
      return NextResponse.json(
        { error: "No anonymous identifier found" },
        { status: 404 }
      );
    }

    const col = await getResponsesCollection();
    const response = await col.findOne(
      { anonymousId },
      { projection: { _id: 0, anonymousId: 0 } }
    );

    if (!response) {
      return NextResponse.json(
        { error: "No response found" },
        { status: 404 }
      );
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("GET /api/responses/me error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const anonymousId = await getAnonymousId();
    if (!anonymousId) {
      return NextResponse.json(
        { error: "No anonymous identifier found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const errors = validateResponse(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    const col = await getResponsesCollection();
    const existing = await col.findOne({ anonymousId });
    if (!existing) {
      return NextResponse.json(
        { error: "No response found. Use POST to create." },
        { status: 404 }
      );
    }

    const updateDoc = buildResponseDoc(body, anonymousId);
    delete updateDoc.anonymousId;
    updateDoc.updatedAt = new Date();

    await col.updateOne({ anonymousId }, { $set: updateDoc });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/responses/me error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
