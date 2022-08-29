import TaskListContainer from "../TaskList/TaskListContainer";
//enums
import { ListTypes } from "../../utils/Enums";

function ManageProgramming() {
    return (
        <TaskListContainer listType={ListTypes.Programming} />
    )
}

export default ManageProgramming