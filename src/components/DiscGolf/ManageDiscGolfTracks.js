import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';
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
   const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });
   const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

   //fetch data
   const { data: tracks, originalData: originalTracks, loading, setData: setTracks } = useFetch(Constants.DB_DISC_GOLF_TRACKS);

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
               <NavButton to={Constants.NAVIGATION_DISC_GOLF_CREATE_TRACK}>
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
