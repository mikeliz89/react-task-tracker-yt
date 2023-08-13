import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageShoppingLists() {
    return (
        <ManageTaskLists listType={ListTypes.Shopping} />
    )
}