import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

function ManageMovieLists() {
    return (
        <ManageTaskLists listType={ListTypes.Movies} />
    )
}

export default ManageMovieLists