import { ExerciseCategories } from "../components/Exercises/Categories";
import { RecipeCategories, FoodItemCategories } from "../components/Recipe/Categories";
import { DrinkCategories } from "../components/Drinks/Categories";
import { DrinkingProductCategories } from "../components/Drinks/Categories";

export function getDrinkCategoryNameByID(id) {
    return getNameByID(DrinkCategories, id);
}

export function getDrinkingProductCategoryNameByID(id) {
    return getNameByID(DrinkingProductCategories, id);
}

export function getRecipeCategoryNameByID(id) {
    return getNameByID(RecipeCategories, id);
}

export function getFoodItemCategoryNameByID(id) {
    return getNameByID(FoodItemCategories, id);
}

/** Get Exercise Category Name by CategoryID */
export function getExerciseCategoryNameByID(id) {
    return getNameByID(ExerciseCategories, id);
}

function getNameByID(arr, id) {
    let obj = arr.find((o) =>
        o.id === Number(id)
    );
    if (obj) {
        return obj.name;
    }
    return '-';
}