import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';
import { ButtonGroup, Row, Col } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import { Link } from 'react-router-dom';

export default function ManageDiscGolf() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   return (
      <>
         <Row>
            <ButtonGroup>

               <GoBackButton />

               <Link to={Constants.NAVIGATION_MANAGE_DISC_GOLF_TRACKS} className='btn btn-primary'>
                  {t('button_tracks')}
               </Link>
            </ButtonGroup>
         </Row>
      </>
   )
}
