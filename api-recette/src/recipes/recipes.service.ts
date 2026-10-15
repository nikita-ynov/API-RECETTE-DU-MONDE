import { Injectable, NotFoundException } from '@nestjs/common';
import type { Recipe } from './interfaces/recipe.interface.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma, RecipeDifficulty } from '../generated/prisma/client.js';


@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.RecipeCreateInput) {
    return this.prisma.recipe.create({ data });
  }

  async recipe(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });
    
    if (!recipe) {
      throw new NotFoundException(
        `Recipe with ID ${id} not found`,
      );
    }

    return recipe;
  }

  async findAll(params: {
    search?: string;
    category?: string;
    cuisine?: string;
    difficulty?: RecipeDifficulty;
    maxPreparationTime?: number;
    maxCookingTime?: number;
    skip?: number;
    take?: number;
    orderBy?: 'newest' | 'oldest' | 'name';
  }) {
    const {
      search,
      category,
      cuisine,
      difficulty,
      maxPreparationTime,
      maxCookingTime,
      skip = 0,
      take = 10,
      orderBy = 'newest',
    } = params;

    const where: Prisma.RecipeWhereInput = {
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(category && { category }),
      ...(cuisine && { cuisine }),
      ...(difficulty && { difficulty }),
      ...(maxPreparationTime !== undefined && {
        preparationTime: { lte: maxPreparationTime },
      }),
      ...(maxCookingTime !== undefined && {
        cookingTime: { lte: maxCookingTime },
      }),
    };

    const orderByMap = {
      newest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
      name: { name: 'asc' },
    } as const;

    const [recipes, total] = await this.prisma.$transaction([
      this.prisma.recipe.findMany({
        where,
        skip,
        take: Math.min(Math.max(take, 1), 100),
        orderBy: orderByMap[orderBy],
      }),
      this.prisma.recipe.count({ where }),
    ]);

    return {
      data: recipes,
      meta: {
        total,
        skip,
        take: Math.min(Math.max(take, 1), 100),
        hasMore: skip + recipes.length < total,
      },
    };
  }

  async updateRecipe(id: number, data: Prisma.RecipeUpdateInput) {
    return this.prisma.recipe.update({
      where: { id },
      data,
    });
  }

  async deleteRecipe(id: number) {
    return this.prisma.recipe.delete({ where: { id } });
  }
}
