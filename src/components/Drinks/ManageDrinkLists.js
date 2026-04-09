import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageDrinkLists() {
    return (
        <ManageTaskLists listType={ListTypes.Drink} />
    )
}



