import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageRecipeLists() {
    return (
        <ManageTaskLists listType={ListTypes.Food} />
    )
}