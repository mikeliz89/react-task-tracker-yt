import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { ButtonGroup, Row } from 'react-bootstrap';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import useFetch from '../useFetch';
import Rounds from './Rounds';
import CenterWrapper from '../Site/CenterWrapper';
import NavButton from '../Buttons/NavButton';

export default function ManageDiscGolf() {

   //translation
   const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });

   //fetch data
   const { data: rounds } = useFetch(DB.DISC_GOLF_ROUNDS);

   const deleteRound = () => {

   }

   return (
      <PageContentWrapper>

         <PageTitle title={t('disc_golf_title')} />

         <Row>
            <ButtonGroup>
               <GoBackButton />
               <NavButton to={NAVIGATION.MANAGE_DISC_GOLF_TRACKS}>
                  {t('button_tracks')}
               </NavButton>
            </ButtonGroup>
         </Row>

         <hr />

         <CenterWrapper>
            <NavButton to={NAVIGATION.DISC_GOLF_START_NEW_ROUND}>
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
