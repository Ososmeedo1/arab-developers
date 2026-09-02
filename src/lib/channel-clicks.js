import { getDb } from "./mongodb";

export async function getChannelClicksCollection() {
  const db = await getDb();
  return db.collection("channelClicks");
}

export async function ensureChannelClicksIndexes() {
  const col = await getChannelClicksCollection();
  await col.createIndex({ clickedAt: -1 });
  await col.createIndex({ anonymousId: 1 });
}

export async function recordChannelClick(anonymousId) {
  const col = await getChannelClicksCollection();

  // Simple deduplication: check if this anonymousId has a click in the last 2 seconds
  const recentClick = await col.findOne({
    anonymousId,
    clickedAt: {
      $gte: new Date(Date.now() - 2000)
    }
  });

  if (recentClick) {
    // Return existing click instead of creating duplicate
    return { recorded: false, reason: "duplicate" };
  }

  const result = await col.insertOne({
    anonymousId,
    clickedAt: new Date()
  });

  return { recorded: true, id: result.insertedId };
}

export async function getChannelClickStats() {
  const col = await getChannelClicksCollection();

  const totalClicks = await col.countDocuments({});

  const lastClickDoc = await col.findOne({}, { sort: { clickedAt: -1 } });
  const lastClick = lastClickDoc ? lastClickDoc.clickedAt : null;

  return { totalClicks, lastClick };
}
