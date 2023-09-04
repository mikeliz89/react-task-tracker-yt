import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';
import { ButtonGroup, Row } from 'react-bootstrap';
import Tracks from './Tracks';
import useFetch from '../useFetch';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import GoBackButton from '../Buttons/GoBackButton';
import { Link } from 'react-router-dom';
import CenterWrapper from '../Site/CenterWrapper';

export default function TracksList() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   //fetch data
   const { data: tracks, loading } = useFetch(Constants.DB_DISC_GOLF_TRACKS);

   const deleteTrack = () => {

   }

   return loading ? (
      <h3>{t('loading')}</h3>
   ) : (
      <PageContentWrapper>

         <PageTitle title={t('tracks')} />

         <Row>
            <ButtonGroup>
               <GoBackButton />
               <Link to={Constants.NAVIGATION_DISC_GOLF_CREATE_TRACK} className='btn btn-primary'>
                  {t('add_new_track')}
               </Link>
            </ButtonGroup>
         </Row>

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
