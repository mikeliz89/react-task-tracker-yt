import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageDrinkLists() {
    return (
        <ManageTaskLists listType={ListTypes.Drink} />
    )
}
