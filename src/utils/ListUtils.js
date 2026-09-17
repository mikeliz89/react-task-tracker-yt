import { GearCategories } from "../components/BackPacking/Categories";
import { DrinkCategories } from "../components/Drinks/Categories";
import { DrinkingProductCategories } from "../components/Drinks/Categories";
import { ExerciseCategories, MovementCategories } from "../components/Exercises/Categories";
import { GameConsoles } from "../components/Games/Categories";
import { MovieFormats } from "../components/Movies/Categories";
import { MusicFormats } from "../components/Music/Categories";
import { RecipeCategories, FoodItemCategories } from "../components/Recipe/Categories";
import { ListTypes } from '../utils/Enums';

import { NAVIGATION } from './Constants';

export const getGearCategoryNameByID = (id) => {
    return getNameByID(GearCategories, id);
};

export const getDrinkCategoryNameByID = (id) => {
    return getNameByID(DrinkCategories, id);
};

export const getDrinkingProductCategoryNameByID = (id) => {
    return getNameByID(DrinkingProductCategories, id);
};

export const getRecipeCategoryNameByID = (id) => {
    return getNameByID(RecipeCategories, id);
};

export const getFoodItemCategoryNameByID = (id) => {
    return getNameByID(FoodItemCategories, id);
};

export const getExerciseCategoryNameByID = (id) => {
    return getNameByID(ExerciseCategories, id);
};

export const getMovementCategoryNameByID = (id) => {
    return getNameByID(MovementCategories, id);
};

export const getMovieFormatNameByID = (id) => {
    return getNameByID(MovieFormats, id);
};

export const getGameConsoleNameByID = (id) => {
    return getNameByID(GameConsoles, id);
};

export const getMusicFormatNameByID = (id) => {
    return getNameByID(MusicFormats, id);
};

export const getNameByID = (arr, id) => {
    let obj = arr.find((o) =>
        o.id === Number(id)
    );
    if (obj) {
        return obj.name;
    }
    return 'none';
};

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
        case ListTypes.BoardGames:
            return 'manage_board_games_title';
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
};

export const getCounterTextContentKey = (listType) => {
    switch (listType) {
        case ListTypes.Shopping:
            return 'countertext_shoppinglists';
        case ListTypes.Drink:
            return 'countertext_drinklists';
        case ListTypes.Programming:
            return 'countertext_programminglists';
        case ListTypes.Food:
            return 'countertext_recipelists';
        case ListTypes.Music:
            return 'countertext_musiclists';
        case ListTypes.Games:
            return 'countertext_gamelists';
        case ListTypes.BoardGames:
            return 'countertext_boardgamelists';
        case ListTypes.Movies:
            return 'countertext_movielists';
        case ListTypes.Other:
            return 'countertext_otherlists';
        case ListTypes.Car:
            return 'countertext_carlists';
        case ListTypes.Exercises:
            return 'countertext_exercises';
        case ListTypes.BackPacking:
            return 'countertext_backpacking';
        default:
            return 'countertext_tasklists';
    }
};

export const getManagePageByListType = (taskList) => {
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
        case ListTypes.BoardGames:
            return NAVIGATION.MANAGE_BOARD_GAMELISTS;
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
};