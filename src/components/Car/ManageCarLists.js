import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageCarLists() {
    return (
        <ManageTaskLists listType={ListTypes.Car} />
    )
}


