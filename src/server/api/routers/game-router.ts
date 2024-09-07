// clerk
import { auth } from "@clerk/nextjs/server"

// trpc
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

// validations
import { startGameSchema } from "@/lib/validations"

export const gameRouter = createTRPCRouter({
  create: publicProcedure
    .input(startGameSchema)
    .mutation(async ({ ctx, input }) => {
      // TODO: check if there is any session still in progress for the user
      //    -> ask user to continue that session or cancel it
      // note: consider to move this under a procedure

      const { type, mode, tableSize } = input
      const { userId: clerkId } = auth()

      // TODO: implement "PVP" & "COOP" game modes
      // ...but first be ready with the basics.
      if (mode !== 'SINGLE') {
        throw new TRPCError({
          message: 'Sorry, but currently you can only play in Single.',
          code: 'NOT_IMPLEMENTED'
        })
      }

      const session: UnsignedGameSessionClient = {
        sessionId: '#sessionId', // TODO: generate session id
        status: 'RUNNING',
        type,
        mode,
        tableSize,
        startedAt: new Date()
      }
      
      if (clerkId) {
        const playerProfile = await ctx.db.playerProfile.findFirst({
          select: {
            id: true,
            user: {
              select: {
                clerkId: true
              }
            }
          },
          where: {
            user: { clerkId }
          }
        })

        if (!playerProfile) {
          throw new TRPCError({
            message: 'Player profile not found.',
            code: 'NOT_FOUND'
          })
        }

        return await ctx.db.gameSession.create({
          data: {
            sessionOwner: {
              connect: {
                id: playerProfile.id
              }
            },
            ...session
          }
        })
      }

      if (type === 'CASUAL' && !clerkId) {
        return session
      }

      if (type === 'COMPETITIVE' && !clerkId) {
        throw new TRPCError({
          message: 'If you want to play in competitive, you must sign in first.',
          code: 'CONFLICT'
        })
      }

      throw new TRPCError({ code: 'BAD_REQUEST' })
    })
})
