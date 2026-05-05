import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { seedCategories } from "./seed-categories";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Categories
  categories: router({
    list: publicProcedure.query(() => db.getCategories()),
    subcategories: publicProcedure
      .input(z.object({ parentId: z.number() }))
      .query(({ input }) => db.getSubcategories(input.parentId)),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getCategoryById(input.id)),
    seed: publicProcedure.mutation(() => seedCategories()),
  }),

  // Communities
  communities: router({
    list: publicProcedure.query(() => db.getPublicCommunities()),
    byCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(({ input }) => db.getCommunitiesByCategory(input.categoryId)),
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .query(({ input }) => db.searchCommunities(input.query)),
    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getCommunityById(input.id)),
    userCommunities: protectedProcedure.query(({ ctx }) =>
      db.getUserCommunities(ctx.user.id)
    ),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          description: z.string().optional(),
          categoryId: z.number(),
          isPublic: z.boolean().default(true),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createCommunity({
          name: input.name,
          description: input.description,
          categoryId: input.categoryId,
          creatorId: ctx.user.id,
          isPublic: input.isPublic,
        })
      ),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).max(255).optional(),
          description: z.string().optional(),
          isPublic: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const community = await db.getCommunityById(input.id);
        if (!community) throw new Error("Community not found");
        if (!(await db.isCommunityAdmin(input.id, ctx.user.id))) {
          throw new Error("Not authorized");
        }
        await db.updateCommunity(input.id, {
          name: input.name,
          description: input.description,
          isPublic: input.isPublic,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!(await db.isCommunityAdmin(input.id, ctx.user.id))) {
          throw new Error("Not authorized");
        }
        await db.deleteCommunity(input.id);
      }),
  }),

  // Community Members
  members: router({
    list: publicProcedure
      .input(z.object({ communityId: z.number() }))
      .query(({ input }) => db.getCommunityMembers(input.communityId)),
    join: protectedProcedure
      .input(z.object({ communityId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const community = await db.getCommunityById(input.communityId);
        if (!community) throw new Error("Community not found");
        if (!community.isPublic) {
          await db.createAccessRequest({
            communityId: input.communityId,
            userId: ctx.user.id,
          });
          return { status: "pending" };
        }
        await db.addCommunityMember({
          communityId: input.communityId,
          userId: ctx.user.id,
        });
        return { status: "joined" };
      }),
    leave: protectedProcedure
      .input(z.object({ communityId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.removeCommunityMember(input.communityId, ctx.user.id);
      }),
    promoteAdmin: protectedProcedure
      .input(z.object({ communityId: z.number(), userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!(await db.isCommunityAdmin(input.communityId, ctx.user.id))) {
          throw new Error("Not authorized");
        }
        await db.promoteToAdmin(input.communityId, input.userId);
      }),
    removeAdmin: protectedProcedure
      .input(z.object({ communityId: z.number(), userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!(await db.isCommunityAdmin(input.communityId, ctx.user.id))) {
          throw new Error("Not authorized");
        }
        await db.removeAdmin(input.communityId, input.userId);
      }),
    kick: protectedProcedure
      .input(z.object({ communityId: z.number(), userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!(await db.isCommunityAdmin(input.communityId, ctx.user.id))) {
          throw new Error("Not authorized");
        }
        await db.removeCommunityMember(input.communityId, input.userId);
      }),
  }),

  // Access Requests
  accessRequests: router({
    list: protectedProcedure
      .input(z.object({ communityId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (!(await db.isCommunityAdmin(input.communityId, ctx.user.id))) {
          throw new Error("Not authorized");
        }
        return db.getAccessRequests(input.communityId);
      }),
    approve: protectedProcedure
      .input(z.object({ requestId: z.number(), communityId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!(await db.isCommunityAdmin(input.communityId, ctx.user.id))) {
          throw new Error("Not authorized");
        }
        await db.approveAccessRequest(input.requestId);
      }),
    reject: protectedProcedure
      .input(z.object({ requestId: z.number(), communityId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (!(await db.isCommunityAdmin(input.communityId, ctx.user.id))) {
          throw new Error("Not authorized");
        }
        await db.rejectAccessRequest(input.requestId);
      }),
  }),

  // Video Meetings
  meetings: router({
    create: protectedProcedure
      .input(
        z.object({
          communityId: z.number(),
          jitsiRoomName: z.string(),
        })
      )
      .mutation(({ ctx, input }) =>
        db.createVideoMeeting({
          communityId: input.communityId,
          jitsiRoomName: input.jitsiRoomName,
          startedBy: ctx.user.id,
        })
      ),
    active: publicProcedure
      .input(z.object({ communityId: z.number() }))
      .query(({ input }) => db.getActiveMeeting(input.communityId)),
    end: protectedProcedure
      .input(z.object({ meetingId: z.number() }))
      .mutation(({ input }) => db.endVideoMeeting(input.meetingId)),
  }),
});

export type AppRouter = typeof appRouter;
