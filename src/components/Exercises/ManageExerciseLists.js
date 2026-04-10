import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageExerciseLists() {
    return (
        <ManageTaskLists listType={ListTypes.Exercises} />
    )
}


