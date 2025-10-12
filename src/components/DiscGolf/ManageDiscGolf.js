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
import NavButton from '../Buttons/NavButton';

export default function ManageDiscGolf() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   //fetch data
   const { data: rounds } = useFetch(Constants.DB_DISC_GOLF_ROUNDS);

   const deleteRound = () => {

   }

   return (
      <PageContentWrapper>

         <PageTitle title={t('disc_golf_title')} />

         <Row>
            <ButtonGroup>
               <GoBackButton />
               <NavButton to={Constants.NAVIGATION_MANAGE_DISC_GOLF_TRACKS}>
                  {t('button_tracks')}
               </NavButton>
            </ButtonGroup>
         </Row>

         <hr />

         <CenterWrapper>
            <NavButton to={Constants.NAVIGATION_DISC_GOLF_START_NEW_ROUND}>
               {t('start_new_round')}
            </NavButton>
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
