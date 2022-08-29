import ManageTaskLists from "../TaskList/ManageTaskLists";
//enums
import { ListTypes } from "../../utils/Enums";

function ManageMusicLists() {
    return (
        <ManageTaskLists listType={ListTypes.Music} />
    )
}

export default ManageMusicLists