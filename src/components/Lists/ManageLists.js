import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageLists() {
    return (
        <ManageTaskLists listType={ListTypes.Other} />
    )
}


