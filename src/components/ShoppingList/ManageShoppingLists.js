import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

function ManageShoppingLists() {
    return (
        <ManageTaskLists listType={ListTypes.Shopping} />
    )
}

export default ManageShoppingLists