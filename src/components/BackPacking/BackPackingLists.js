import ManageTaskLists from "../TaskList/ManageTaskLists";
//enums
import { ListTypes } from "../../utils/Enums";

function BackPackingLists() {
    return (
        <ManageTaskLists listType={ListTypes.BackPacking} />
    )
}

export default BackPackingLists