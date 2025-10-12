import { ExerciseCategories, MovementCategories } from "../components/Exercises/Categories";
import { RecipeCategories, FoodItemCategories } from "../components/Recipe/Categories";
import { DrinkCategories } from "../components/Drinks/Categories";
import { DrinkingProductCategories } from "../components/Drinks/Categories";
import { GearCategories } from "../components/BackPacking/Categories";
import { ListTypes } from '../utils/Enums';
import { GameConsoles } from "../components/Games/Categories";
import { MovieFormats } from "../components/Movies/Categories";
import { MusicFormats } from "../components/Music/Categories";
import { NAVIGATION } from './Constants';

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

export function getMovieFormatNameByID(id) {
    return getNameByID(MovieFormats, id);
}

export function getGameConsoleNameByID(id) {
    return getNameByID(GameConsoles, id);
}

export function getMusicFormatNameByID(id) {
    return getNameByID(MusicFormats, id);
}

function getNameByID(arr, id) {
    let obj = arr.find((o) =>
        o.id === Number(id)
    );
    if (obj) {
        return obj.name;
    }
    return 'none';
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
        case ListTypes.Exercises:
            return 'manage_exercise_lists_title';
        //TODO: Koodaa lisää caseja sitä mukaa kuin muistakin listatyypeistä on olemassa listasivu
        default: return 'manage_tasklists_title';
    }
}

export function getManagePageByListType(taskList) {
    const listType = taskList["listType"] || ListTypes.None;
    switch (listType) {
        case ListTypes.Programming:
            return NAVIGATION.MANAGE_PROGRAMMING;
        case ListTypes.Shopping:
            return NAVIGATION.MANAGE_SHOPPINGLISTS;
        case ListTypes.Food:
            return NAVIGATION.MANAGE_RECIPELISTS;
        case ListTypes.Drink:
            return NAVIGATION.MANAGE_DRINKLISTS;
        case ListTypes.BackPacking:
            return NAVIGATION.MANAGE_BACKPACKINGLISTS;
        case ListTypes.Music:
            return NAVIGATION.MANAGE_MUSICLISTS;
        case ListTypes.Games:
            return NAVIGATION.MANAGE_GAMELISTS;
        case ListTypes.Movies:
            return NAVIGATION.MANAGE_MOVIELISTS;
        case ListTypes.Exercises:
            return NAVIGATION.MANAGE_EXERCISE_LISTS;
        case ListTypes.Car:
            return NAVIGATION.MANAGE_CARLISTS;
        case ListTypes.Other:
            return NAVIGATION.MANAGE_LISTS;
        // Lisää muut tarvittavat tyypit
        default:
            return NAVIGATION.MANAGE_TASKLISTS;
    }
}