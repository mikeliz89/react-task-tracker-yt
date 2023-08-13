import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageMusicLists() {
    return (
        <ManageTaskLists listType={ListTypes.Music} />
    )
}