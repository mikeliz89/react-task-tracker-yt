import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';
import { ButtonGroup, Row, Col } from 'react-bootstrap';
import GoBackButton from '../Buttons/GoBackButton';
import { Link } from 'react-router-dom';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import useFetch from '../useFetch';
import Rounds from './Rounds';
import CenterWrapper from '../Site/CenterWrapper';

export default function ManageDiscGolf() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   //fetch data
   const { data: rounds, setData: setRounds,
      originalData: originalRounds, counter, loading } = useFetch(Constants.DB_DISC_GOLF_ROUNDS);

   const deleteRound = () => {

   }

   return (
      <PageContentWrapper>

         <PageTitle title={t('disc_golf_title')} />

         <Row>
            <ButtonGroup>

               <GoBackButton />

               <Link to={Constants.NAVIGATION_MANAGE_DISC_GOLF_TRACKS} className='btn btn-primary'>
                  {t('button_tracks')}
               </Link>
            </ButtonGroup>
         </Row>

         <CenterWrapper>
            <Link to={Constants.NAVIGATION_DISC_GOLF_START_NEW_ROUND} className='btn btn-primary'>
               {t('start_new_round')}
            </Link>
         </CenterWrapper>

         {
            rounds != null && rounds.length > 0 ? (
               <>
                  {
                     <Rounds rounds={rounds} onDelete={() => deleteRound()} />
                  }
               </>
            ) : (
               <>
                  <CenterWrapper>
                     {t('no_previous_rounds_to_show')}
                  </CenterWrapper>
               </>
            )
         }

      </PageContentWrapper>
   )
}
