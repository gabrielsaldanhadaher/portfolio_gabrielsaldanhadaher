import { eq, and, or, like, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, categories, communities, communityMembers, accessRequests, videoMeetings, InsertCategory, InsertCommunity, InsertCommunityMember, InsertAccessRequest, InsertVideoMeeting } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ CATEGORIES ============

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).where(isNull(categories.parentId));
}

export async function getSubcategories(parentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).where(eq(categories.parentId, parentId));
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(categories).where(eq(categories.id, id));
  return result[0] || null;
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(categories).where(eq(categories.slug, slug));
  return result[0] || null;
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(categories).values(data);
}

// ============ COMMUNITIES ============

export async function getCommunities() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communities);
}

export async function getPublicCommunities() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communities).where(eq(communities.isPublic, true));
}

export async function getCommunitiesByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(communities)
    .where(
      and(
        eq(communities.categoryId, categoryId),
        eq(communities.isPublic, true)
      )
    );
}

export async function searchCommunities(query: string) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(communities)
    .where(
      and(
        like(communities.name, `%${query}%`),
        eq(communities.isPublic, true)
      )
    );
}

export async function getCommunityById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(communities).where(eq(communities.id, id));
  return result[0] || null;
}

export async function getUserCommunities(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const members = await db
    .select()
    .from(communityMembers)
    .where(eq(communityMembers.userId, userId));

  const communityIds = members.map((m) => m.communityId);
  if (communityIds.length === 0) return [];

  return db
    .select()
    .from(communities)
    .where(eq(communities.id, communityIds[0]));
}

export async function createCommunity(data: InsertCommunity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(communities).values(data);
}

export async function updateCommunity(
  id: number,
  data: Partial<InsertCommunity>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communities).set(data).where(eq(communities.id, id));
}

export async function deleteCommunity(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(communities).where(eq(communities.id, id));
}

// ============ COMMUNITY MEMBERS ============

export async function getCommunityMembers(communityId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(communityMembers)
    .where(eq(communityMembers.communityId, communityId));
}

export async function getMemberCount(communityId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(communityMembers)
    .where(eq(communityMembers.communityId, communityId));
  return result.length;
}

export async function isCommunityMember(
  communityId: number,
  userId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(communityMembers)
    .where(
      and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      )
    );
  return result.length > 0;
}

export async function isCommunityAdmin(
  communityId: number,
  userId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(communityMembers)
    .where(
      and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId),
        eq(communityMembers.isAdmin, true)
      )
    );
  return result.length > 0;
}

export async function addCommunityMember(data: InsertCommunityMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(communityMembers).values(data);

  // Update member count
  const count = await getMemberCount(data.communityId);
  await db
    .update(communities)
    .set({ memberCount: count })
    .where(eq(communities.id, data.communityId));
}

export async function removeCommunityMember(
  communityId: number,
  userId: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .delete(communityMembers)
    .where(
      and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      )
    );

  // Update member count
  const count = await getMemberCount(communityId);
  await db
    .update(communities)
    .set({ memberCount: count })
    .where(eq(communities.id, communityId));
}

export async function promoteToAdmin(communityId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(communityMembers)
    .set({ isAdmin: true })
    .where(
      and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      )
    );
}

export async function removeAdmin(communityId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(communityMembers)
    .set({ isAdmin: false })
    .where(
      and(
        eq(communityMembers.communityId, communityId),
        eq(communityMembers.userId, userId)
      )
    );
}

// ============ ACCESS REQUESTS ============

export async function createAccessRequest(data: InsertAccessRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(accessRequests).values(data);
}

export async function getAccessRequests(communityId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(accessRequests)
    .where(
      and(
        eq(accessRequests.communityId, communityId),
        eq(accessRequests.status, "pending")
      )
    );
}

export async function approveAccessRequest(requestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(accessRequests)
    .set({ status: "approved" })
    .where(eq(accessRequests.id, requestId));
}

export async function rejectAccessRequest(requestId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(accessRequests)
    .set({ status: "rejected" })
    .where(eq(accessRequests.id, requestId));
}

// ============ VIDEO MEETINGS ============

export async function createVideoMeeting(data: InsertVideoMeeting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(videoMeetings).values(data);
  // Retornar os dados criados
  return data;
}

export async function getActiveMeeting(communityId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(videoMeetings)
    .where(
      and(
        eq(videoMeetings.communityId, communityId),
        eq(videoMeetings.isActive, true)
      )
    );
  return result[0] || null;
}

export async function endVideoMeeting(meetingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(videoMeetings)
    .set({ isActive: false, endedAt: new Date() })
    .where(eq(videoMeetings.id, meetingId));
}
