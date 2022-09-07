import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

function ManageDrinkLists() {
    return (
        <ManageTaskLists listType={ListTypes.Drink} />
    )
}

export default ManageDrinkLists