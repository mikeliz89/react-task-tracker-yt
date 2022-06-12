//i18n
import i18n from "i18next";
//utils
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';

function DrinkHistories({ drinkHistories }) {
    return (
        <div>
            {drinkHistories.map((historyRow) => (
                <p key={historyRow.id}>{getJsonAsDateTimeString(historyRow.currentDateTime, i18n.language)}</p>
            ))}
        </div>
    )
}

export default DrinkHistories
