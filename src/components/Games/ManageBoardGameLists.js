import { ListTypes } from "../../utils/Enums";
import ManageTaskLists from "../TaskList/ManageTaskLists";

export default function ManageBoardGameLists() {
    return (
        <ManageTaskLists listType={ListTypes.BoardGames} />
    )
}



