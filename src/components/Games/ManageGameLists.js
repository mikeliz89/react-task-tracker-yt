import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageGameLists() {
    return (
        <ManageTaskLists listType={ListTypes.Games} />
    )
}


