import { useTranslation } from 'react-i18next';

import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';
import ManageGeneric from '../Common/ManageGeneric';
import AddRecord from './AddRecord';
import Record from './Record';
import ListMapper from '../Common/ListMapper';

export default function ManageMusicRecords() {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    return (
        <ManageGeneric
            dbKey={DB.MUSIC_RECORDS}
            translationKey={TRANSLATION.MUSIC}
            AddComponent={AddRecord}
            ListComponent={ListMapper}
            ListComponentProps={{
                ItemComponent: Record,
                dbUrl: DB.MUSIC_RECORDS,
                detailsNavigation: NAVIGATION.MUSIC_RECORD,
                showConsole: false
            }}
            iconName={ICONS.MUSIC}
            title={t('music_records_title')}
            topActions={
                <NavButton to={NAVIGATION.MANAGE_MUSICLISTS} icon={ICONS.LIST_ALT}>
                    {t('button_music_lists')}
                </NavButton>
            }
            searchSortFilterOptions={{
                showSearchByText: true,
                showSearchByDescription: true,
                defaultSort: 'Name_ASC',
                showSortByName: true,
                showSortByStarRating: true,
                showSortByCreatedDate: true,
                showSortByPublishYear: true,
                filterMode: 'NameOrBand',
                showFilterHaveAtHome: true,
                showFilterHaveRated: true,
            }}
            copyButton={{ showCopyButton: true }}
        />
    );
}



