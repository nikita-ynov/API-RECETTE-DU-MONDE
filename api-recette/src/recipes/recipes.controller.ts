import { Controller, Get, Post,HttpCode, Body, Query, ParseIntPipe, DefaultValuePipe, Param, Put, Delete } from '@nestjs/common';
import { CreateRecipeDto } from "./dto/create-recipe.dto.js";
import { UpdateRecipeDto } from "./dto/update-recipe.dto.js";
import { RecipesService } from "./recipes.service.js";
import { RecipeDifficulty } from '../generated/prisma/client.js';
import type { Recipe } from "./interfaces/recipe.interface.js";
import { toRecipeCreateInput, toRecipeUpdateInput } from './recipes.mapper.js';

@Controller('recipes')
export class RecipesController {
    constructor(private recipesService: RecipesService) { }

    @Get()
    findAll(
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('cuisine') cuisine?: string,
        @Query('difficulty') difficulty?: RecipeDifficulty,
        @Query('maxPreparationTime') maxPreparationTime?: string,
        @Query('maxCookingTime') maxCookingTime?: string,
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
        @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
        @Query('orderBy') orderBy?: 'newest' | 'oldest' | 'name',
    ) {
        return this.recipesService.findAll({
            search,
            category,
            cuisine,
            difficulty,
            maxPreparationTime:
                maxPreparationTime === undefined ? undefined : Number(maxPreparationTime),
            maxCookingTime:
                maxCookingTime === undefined ? undefined : Number(maxCookingTime),
            skip,
            take,
            orderBy,
        });
    }

    @Post()
    @HttpCode(201)
    create(@Body() createRecipeDto: CreateRecipeDto) {
        return this.recipesService.create(toRecipeCreateInput(createRecipeDto));
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.recipesService.recipe(id)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateRecipeDto: UpdateRecipeDto) {
        return this.recipesService.updateRecipe(id, toRecipeUpdateInput(updateRecipeDto))
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.recipesService.deleteRecipe(id)
    }
}
