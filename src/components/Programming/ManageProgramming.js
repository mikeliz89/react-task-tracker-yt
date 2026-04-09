import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageProgramming() {
    return (
        <ManageTaskLists listType={ListTypes.Programming} />
    )
}


