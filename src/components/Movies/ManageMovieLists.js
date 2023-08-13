import ManageTaskLists from "../TaskList/ManageTaskLists";
import { ListTypes } from "../../utils/Enums";

export default function ManageMovieLists() {
    return (
        <ManageTaskLists listType={ListTypes.Movies} />
    )
}