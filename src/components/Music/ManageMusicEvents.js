import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';
import ManageGeneric from '../Common/ManageGeneric';
import AddEvent from './AddEvent';
import ListMapper from '../Common/ListMapper';
import Event from './Event';

export default function ManageMusicEvents() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    return (
        <ManageGeneric
            dbKey={DB.MUSIC_EVENTS}
            translationKey={TRANSLATION.MUSIC}
            AddComponent={AddEvent}
            ListComponent={ListMapper}
            ListComponentProps={{ ItemComponent: Event }}
            iconName={ICONS.MUSIC}
            title={t('music_events_title')}
            modalTitle={t('modal_header_add_event')}
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
                filterMode: 'Name',
                showFilterHaveRated: true,
            }}
            copyButton={{ showCopyButton: true }}
        />
    );
}



