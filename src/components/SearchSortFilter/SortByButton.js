import Button from "../Buttons/Button";
import { TRANSLATION, ICONS } from '../../utils/Constants';
import { useTranslation } from 'react-i18next';

export default function SortByButton({ sortBy, sortModeASC, sortModeDESC, title, onSortBy }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.SEARCHSORTFILTER });

    return (
        <>
            <Button
                iconName={sortBy === sortModeDESC ? ICONS.ARROW_DOWN : sortBy === sortModeASC ? ICONS.ARROW_UP : ''}
                onClick={() => {
                    sortBy === sortModeASC ? onSortBy(sortModeDESC) : onSortBy(sortModeASC);
                }}
                text={t(title)} type="button" />
        </>
    )
}