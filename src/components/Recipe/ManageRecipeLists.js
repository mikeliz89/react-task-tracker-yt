import ManageTaskLists from "../TaskList/ManageTaskLists";
//enums
import { ListTypes } from "../../utils/Enums";

function ManageRecipeLists() {
    return (
        <ManageTaskLists listType={ListTypes.Food} />
    )
}

export default ManageRecipeLists