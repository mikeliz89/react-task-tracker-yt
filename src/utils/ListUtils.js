import { ExerciseCategories } from "../components/Exercises/Categories";
import { RecipeCategories } from "../components/Recipe/Categories";

export function getRecipeCategoryNameByID(id) {
    return getNameByID(RecipeCategories, id);
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