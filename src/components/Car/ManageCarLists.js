import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageCarLists() {
    return (
        <ManageTaskLists listType={ListTypes.Car} />
    )
}