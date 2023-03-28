import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

function ManageLists() {
    return (
        <ManageTaskLists listType={ListTypes.Other} />
    )
}

export default ManageLists