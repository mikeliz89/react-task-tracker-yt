import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageBackPackingLists() {
    return (
        <ManageTaskLists listType={ListTypes.BackPacking} />
    )
}