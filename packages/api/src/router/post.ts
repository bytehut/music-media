import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  byId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.post.findFirst({ where: { id: parseInt(input) } });
  }),
  create: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.post.create({
      data: {
        content: input,
        authorUsername: "test",
      },
    });
  }),
});
