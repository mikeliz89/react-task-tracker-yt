import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { ButtonGroup, Row } from 'react-bootstrap';
import Tracks from './Tracks';
import useFetch from '../useFetch';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import GoBackButton from '../Buttons/GoBackButton';
import CenterWrapper from '../Site/CenterWrapper';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import NavButton from '../Buttons/NavButton';

export default function TracksList() {

   //translation
   const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });
   const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

   //fetch data
   const { data: tracks, originalData: originalTracks, loading, setData: setTracks } = useFetch(DB.DISC_GOLF_TRACKS);

   const deleteTrack = () => {

   }

   return loading ? (
      <h3>{tCommon("loading")}</h3>
   ) : (
      <PageContentWrapper>

         <PageTitle title={t('tracks')} />

         <Row>
            <ButtonGroup>
               <GoBackButton />
               <NavButton to={NAVIGATION.DISC_GOLF_CREATE_TRACK}>
                  {t('add_new_track')}
               </NavButton>
            </ButtonGroup>
         </Row>


         {
            originalTracks != null && originalTracks.length > 0 ? (
               <SearchSortFilter
                  originalList={originalTracks} onSet={setTracks}
                  showSortByCreatedDate={true}
               />
            ) : (<></>)
         }

         {
            tracks != null && tracks.length > 0 ? (
               <>
                  {
                     <Tracks tracks={tracks} onDelete={() => deleteTrack()} />
                  }
               </>
            ) : (
               <>
                  <CenterWrapper>
                     {t('no_tracks_to_show')}
                  </CenterWrapper>
               </>
            )
         }

      </PageContentWrapper>
   )
}
