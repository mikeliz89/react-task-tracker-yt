import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageBackPackingLists() {
    return (
        <ManageTaskLists listType={ListTypes.BackPacking} />
    )
}


