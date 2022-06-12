import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import i18n from "i18next";

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
