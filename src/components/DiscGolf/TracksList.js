import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';
import { ButtonGroup, Row, Col } from 'react-bootstrap';
import Button from '../Buttons/Button';
import Tracks from './Tracks';
import useFetch from '../UseFetch';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import GoBackButton from '../Buttons/GoBackButton';
import { Link } from 'react-router-dom';

export default function TracksList() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   //fetch data
   const { data: tracks, setData: setTracks,
      originalData: originalTracks, counter, loading } = useFetch(Constants.DB_DISC_GOLF_TRACKS);

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
               <Link to={Constants.NAVIGATION_DISCGOLF_ADD_NEW_TRACK} className='btn btn-primary'>
                  {t('add_new_track')}
               </Link>
            </ButtonGroup>
         </Row>
         <Tracks tracks={tracks} onDelete={() => deleteTrack()} />
      </PageContentWrapper>
   )
}
