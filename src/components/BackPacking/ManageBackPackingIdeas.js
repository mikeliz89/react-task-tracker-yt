import ManageTaskLists from "../TaskList/ManageTaskLists";
//enums
import { ListTypes } from "../../utils/Enums";

function ManageBackPackingIdeas() {
    return (
        <ManageTaskLists listType={ListTypes.BackPacking} />
    )
}

export default ManageBackPackingIdeas