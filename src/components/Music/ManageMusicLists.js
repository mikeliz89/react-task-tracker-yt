import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageMusicLists() {
    return (
        <ManageTaskLists listType={ListTypes.Music} />
    )
}


