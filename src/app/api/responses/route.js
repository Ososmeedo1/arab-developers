import { NextResponse } from "next/server";
import { getOrCreateAnonymousId } from "@/lib/cookie";
import { getResponsesCollection, ensureIndexes } from "@/lib/mongodb";
import { validateResponse, buildResponseDoc } from "@/lib/validation";

let indexesEnsured = false;
const rateLimit = new Map();

function isRateLimited(id) {
  const now = Date.now();
  const windowStart = now - 60 * 1000;
  const hits = rateLimit.get(id) || [];
  const recent = hits.filter((t) => t > windowStart);
  if (recent.length >= 10) {
    rateLimit.set(id, recent);
    return true;
  }
  recent.push(now);
  rateLimit.set(id, recent);
  return false;
}

export async function POST(request) {
  try {
    const { id: anonymousId } = await getOrCreateAnonymousId();

    if (isRateLimited(anonymousId)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const errors = validateResponse(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    const col = await getResponsesCollection();
    if (!indexesEnsured) {
      await ensureIndexes();
      indexesEnsured = true;
    }

    const existing = await col.findOne({ anonymousId });
    if (existing) {
      return NextResponse.json(
        { error: "Response already exists. Use PATCH to update." },
        { status: 409 }
      );
    }

    const doc = buildResponseDoc(body, anonymousId);
    doc.createdAt = new Date();
    doc.updatedAt = new Date();

    await col.insertOne(doc);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/responses error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
