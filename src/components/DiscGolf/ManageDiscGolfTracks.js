import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import Tracks from './Tracks';
import useFetch from '../Hooks/useFetch';
import ManagePage from '../Site/ManagePage';
import NavButton from '../Buttons/NavButton';

export default function TracksList() {

   //translation
   const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });
   const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

   //fetch data
   const { data: tracks, originalData: originalTracks, loading, setData: setTracks } = useFetch(DB.DISC_GOLF_TRACKS);

   const deleteTrack = () => {

   }

   return (
      <ManagePage
         loading={loading}
         loadingText={tCommon("loading")}
         title={t('tracks')}
         topActions={(
            <>
               <NavButton to={NAVIGATION.DISC_GOLF_CREATE_TRACK}>
                  {t('add_new_track')}
               </NavButton>
            </>
         )}
         searchSortFilter={{
            originalList: originalTracks,
            onSet: setTracks,
            showSortByCreatedDate: true,
         }}
         hasItems={tracks != null && tracks.length > 0}
         emptyText={t('no_tracks_to_show')}
      >
         <>
            <Tracks tracks={tracks} onDelete={() => deleteTrack()} />
         </>
      </ManagePage>
   )
}
