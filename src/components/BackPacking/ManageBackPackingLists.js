import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

function ManageBackPackingLists() {
    return (
        <ManageTaskLists listType={ListTypes.BackPacking} />
    )
}

export default ManageBackPackingLists