//Drinks
import DrinkHistory from "./DrinkHistory";
//Firebase
import { db } from '../../firebase-config';
import { ref, remove } from "firebase/database";
//react
import { useTranslation } from "react-i18next";
import { FaHistory } from "react-icons/fa";
import { useState, useEffect } from "react";

function DrinkHistories({ drinkHistories, drinkID }) {

    //constants
    const DB_DRINK_HISTORY = '/drinkhistory';

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [counter, setCounter] = useState(0);

    //load data
    useEffect(() => {
        setCounter(drinkHistories.length);
    }, []);

    const deleteDrinkHistory = (drinkHistoryID) => {
        const dbref = ref(db, `${DB_DRINK_HISTORY}/${drinkID}/${drinkHistoryID}`);
        remove(dbref);
    }

    return (
        <div>
            <h4>
                <FaHistory style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                {t('drinkhistory_title')} {counter > 0 ? '(' + counter + ')' : ''}
            </h4>
            {drinkHistories.map((drinkHistory) => (
                <DrinkHistory key={drinkHistory.id} drinkHistory={drinkHistory} onDelete={deleteDrinkHistory} />
            ))}
        </div>
    )
}

export default DrinkHistories
