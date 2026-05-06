import { TRANSLATION, DB, NAVIGATION, ICONS } from '../../utils/Constants';
import NavButton from '../Buttons/NavButton';
import ManageGeneric from '../Common/ManageGeneric';
import Tracks from './Tracks';
import { useTranslation } from 'react-i18next';

export default function TracksList() {

   const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });
   return (
      <ManageGeneric
         dbKey={DB.DISC_GOLF_TRACKS}
         translationKey={TRANSLATION.DISC_GOLF}
         ListComponent={Tracks}
         iconName={ICONS.GAMEPAD}
         title={t('tracks')}
         topActions={
            <NavButton to={NAVIGATION.DISC_GOLF_CREATE_TRACK}>
               {t('add_new_track')}
            </NavButton>
         }
         searchSortFilterOptions={{
            showSortByCreatedDate: true,
            showSortByTrackName: true,
         }}
      />
   );
}



