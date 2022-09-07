import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

function ManageGameLists() {
    return (
        <ManageTaskLists listType={ListTypes.Games} />
    )
}

export default ManageGameLists