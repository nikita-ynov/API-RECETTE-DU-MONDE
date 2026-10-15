import { Module } from "@nestjs/common";
import { RecipesController } from "./recipes.controller.js";
import { RecipesService } from "./recipes.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
    imports: [PrismaModule],
    controllers: [RecipesController],
    providers: [RecipesService],
})
export class RecipesModule { }