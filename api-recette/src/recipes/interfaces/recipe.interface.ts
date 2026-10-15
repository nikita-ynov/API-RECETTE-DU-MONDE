export interface Recipe {
    // id: number;
    name: string;
    description: string;
    image: string;

    ingredients: Ingredient[];
    instructions: string[];

    preparationTime: number;
    cookingTime: number;
    servings: number;

    difficulty: RecipeDifficulty;
    category: string;
    cuisine: string;

    // createdAt: Date;
    // updatedAt: Date;
}

export interface Ingredient {
    name: string;
    quantity: number;
    unit: IngredientUnit;
}

export type RecipeDifficulty = "facile" | "moyenne" | "dure";

export type IngredientUnit =
    | "g"
    | "kg"
    | "ml"
    | "l"
    | "unit"
    | "cuillère à café"
    | "cuillère à soupe";
