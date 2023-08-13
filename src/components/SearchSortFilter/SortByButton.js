import Button from "../Buttons/Button";
import * as Constants from '../../utils/Constants';
import { useTranslation } from 'react-i18next';

const SortByButton = ({ sortBy, sortModeASC, sortModeDESC, title, onSortBy }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_SEARCHSORTFILTER, { keyPrefix: Constants.TRANSLATION_SEARCHSORTFILTER });

    return (
        <>
            <Button
                iconName={sortBy === sortModeDESC ? Constants.ICON_ARROW_DOWN : sortBy === sortModeASC ? Constants.ICON_ARROW_UP : ''}
                onClick={() => {
                    sortBy === sortModeASC ? onSortBy(sortModeDESC) : onSortBy(sortModeASC);
                }}
                text={t(title)} type="button" />
        </>
    )
}

export default SortByButton;