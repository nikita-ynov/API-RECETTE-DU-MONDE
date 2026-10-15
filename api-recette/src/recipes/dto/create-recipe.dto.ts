
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    IsArray,
    ArrayNotEmpty,
    ValidateNested,
    IsIn,
    IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecipeDifficulty, RecipeIngredient } from '../../generated/prisma/client.js';

export type IngredientUnit =
    | 'g'
    | 'kg'
    | 'ml'
    | 'l'
    | 'unit'
    | 'cuillère à café'
    | 'cuillère à soupe';

export class Ingredient {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @Min(0.01)
    quantity: number;

    @IsIn([
        'g',
        'kg',
        'ml',
        'l',
        'unit',
        'cuillère à café',
        'cuillère à soupe',
    ])
    unit: IngredientUnit;
}

export class CreateRecipeDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => Ingredient)
    ingredients: Ingredient[];

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    instructions: string[];

    @IsNumber()
    @Min(0)
    preparationTime: number;

    @IsNumber()
    @Min(0)
    cookingTime: number;

    @IsNumber()
    @Min(1)
    servings: number;

    @IsEnum(RecipeDifficulty)
    difficulty: RecipeDifficulty;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    cuisine: string;
}
