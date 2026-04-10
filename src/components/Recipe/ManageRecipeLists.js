import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageRecipeLists() {
    return (
        <ManageTaskLists listType={ListTypes.Food} />
    )
}


