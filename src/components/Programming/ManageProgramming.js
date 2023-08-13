import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageProgramming() {
    return (
        <ManageTaskLists listType={ListTypes.Programming} />
    )
}