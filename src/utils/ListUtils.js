import { ExerciseCategories, MovementCategories } from "../components/Exercises/Categories";
import { RecipeCategories, FoodItemCategories } from "../components/Recipe/Categories";
import { DrinkCategories } from "../components/Drinks/Categories";
import { DrinkingProductCategories } from "../components/Drinks/Categories";
import { GearCategories } from "../components/BackPacking/Categories";

import { ListTypes } from '../utils/Enums';

export function getGearCategoryNameByID(id) {
    return getNameByID(GearCategories, id);
}

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

export function getExerciseCategoryNameByID(id) {
    return getNameByID(ExerciseCategories, id);
}

export function getMovementCategoryNameByID(id) {
    return getNameByID(MovementCategories, id);
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

export const getPageTitleContent = (listType) => {
    switch (listType) {
        case ListTypes.Programming:
            return 'manage_programming_title';
        case ListTypes.BackPacking:
            return 'manage_backpacking_title';
        case ListTypes.Music:
            return 'manage_music_title';
        case ListTypes.Car:
            return 'manage_car_title';
        case ListTypes.Food:
            return 'manage_recipe_title';
        case ListTypes.Drink:
            return 'manage_drinks_title';
        case ListTypes.Games:
            return 'manage_games_title';
        case ListTypes.Shopping:
            return 'manage_shoppinglists_title';
        case ListTypes.Movies:
            return 'manage_movies_title';
        case ListTypes.Other:
            return 'manage_other_lists_title';
        //TODO: Koodaa lisää caseja sitä mukaa kuin muistakin listatyypeistä on olemassa listasivu
        default: return 'manage_tasklists_title';
    }
}