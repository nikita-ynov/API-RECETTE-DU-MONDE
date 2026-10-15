
import { Prisma } from '../generated/prisma/client.js';
import { CreateRecipeDto } from './dto/create-recipe.dto.js';
import { UpdateRecipeDto } from './dto/update-recipe.dto.js';

export function toRecipeCreateInput(
  dto: CreateRecipeDto,
): Prisma.RecipeCreateInput {
  const { ingredients, ...recipeData } = dto;

  return {
    ...recipeData,
    ingredients: {
      create: ingredients.map(({ name, quantity, unit }) => ({
        quantity,
        unit,
        ingredient: {
          connectOrCreate: {
            where: { name },
            create: { name },
          },
        },
      })),
    },
  };
  
}
export function toRecipeUpdateInput(
  dto: UpdateRecipeDto,
): Prisma.RecipeUpdateInput {
  const { ingredients, ...recipeData } = dto;

  return {
    ...recipeData,
    ...(ingredients !== undefined && {
      ingredients: {
        deleteMany: {},
        create: ingredients.map(({ name, quantity, unit }) => ({
          quantity,
          unit,
          ingredient: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    }),
  };
}