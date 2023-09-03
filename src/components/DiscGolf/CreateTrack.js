import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import TrackHoles from './TrackHoles';

export default function CreateTrack() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   //states
   const [trackName, setTrackName] = useState('');
   const [description, setDescription] = useState('');

   const defaultPar = 3;
   const myArray = [
      { id: 1, par: defaultPar },
      { id: 2, par: defaultPar },
      { id: 3, par: defaultPar },
      { id: 4, par: defaultPar },
      { id: 5, par: defaultPar },
      { id: 6, par: defaultPar },
      { id: 7, par: defaultPar },
      { id: 8, par: defaultPar },
      { id: 9, par: defaultPar }
   ];

   const [holes, setHoles] = useState(myArray);

   /*
   useEffect(() => {
      //sortCategoriesByName();
   }, [holes]);
   */

   const sortCategoriesByName = () => {

   }

   const createDefaultHoles = () => {
      let newHole = { id: ++holes.length, par: defaultPar }
      let currentHoles = holes;
      currentHoles.push(newHole);
      console.log(currentHoles);
      setHoles(currentHoles);
   }

   async function onSubmit(e) {
      e.preventDefault();

      if (holes.length < 1) {
         alert("Lisää vähintään yksi väylä");
         return;
      }

      try {

      } catch (error) {
         console.log(error);
      }
   }

   return (
      <>
         <GoBackButton />
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="createTrackForm-TrackName">
               <Form.Label>{t('track_name')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={t('track_name')}
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="createTrackForm-Description">
               <Form.Label>{t('track_description')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={t('track_description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>

            {holes != null && holes.length > 0 &&
               <>
                  <TrackHoles holes={holes} />
               </>
            }
            <Row>
               <ButtonGroup>
                  <Button text={t('button_add_holes')} iconName={Constants.ICON_PLUS}
                     type='button' onClick={() => createDefaultHoles()} />
               </ButtonGroup>
               <hr style={{ marginTop: '20px' }} />
               <ButtonGroup>
                  <Button type='submit' text={t('button_save_track')} className='btn btn-block saveBtn' />
               </ButtonGroup>
            </Row>
         </Form>
      </>
   )
}
