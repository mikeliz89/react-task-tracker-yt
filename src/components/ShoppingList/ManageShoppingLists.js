import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageShoppingLists() {
    return (
        <ManageTaskLists listType={ListTypes.Shopping} />
    )
}


