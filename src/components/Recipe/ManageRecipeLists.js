import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

function ManageRecipeLists() {
    return (
        <ManageTaskLists listType={ListTypes.Food} />
    )
}

export default ManageRecipeLists