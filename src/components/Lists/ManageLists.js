import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageLists() {
    return (
        <ManageTaskLists listType={ListTypes.Other} />
    )
}