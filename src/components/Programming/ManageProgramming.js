import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

function ManageProgramming() {
    return (
        <ManageTaskLists listType={ListTypes.Programming} />
    )
}

export default ManageProgramming