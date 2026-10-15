import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { RecipesModule } from './recipes/recipes.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RecipesModule,
  ],
})
export class AppModule { }
