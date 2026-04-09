import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageMovieLists() {
    return (
        <ManageTaskLists listType={ListTypes.Movies} />
    )
}


