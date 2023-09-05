import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageExerciseLists() {
    return (
        <ManageTaskLists listType={ListTypes.Exercises} />
    )
}