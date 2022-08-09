//Drinks
import DrinkHistory from "./DrinkHistory";
//Firebase
import { db } from '../../firebase-config';
import { ref, remove } from "firebase/database";

function DrinkHistories({ drinkHistories, drinkID }) {

    const DB_DRINK_HISTORY = '/drinkhistory';

    const deleteDrinkHistory = (drinkHistoryID) => {
        console.log(drinkHistoryID);
        const dbref = ref(db, `${DB_DRINK_HISTORY}/${drinkID}/${drinkHistoryID}`);
        remove(dbref);
    }

    return (
        <div>
            {drinkHistories.map((drinkHistory) => (
                <DrinkHistory key={drinkHistory.id} drinkHistory={drinkHistory} onDelete={deleteDrinkHistory} />
            ))}
        </div>
    )
}

export default DrinkHistories
