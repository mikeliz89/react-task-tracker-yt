import { ExerciseCategories } from "../components/Exercises/Categories";

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