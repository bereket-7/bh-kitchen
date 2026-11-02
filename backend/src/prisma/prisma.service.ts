import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is required. Copy backend/.env.example to backend/.env.",
      );
    }

    super();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
