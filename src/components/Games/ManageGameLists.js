import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageGameLists() {
    return (
        <ManageTaskLists listType={ListTypes.Games} />
    )
}