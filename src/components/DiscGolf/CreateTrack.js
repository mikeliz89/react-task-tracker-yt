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

   //constants
   const maxHoleCount = 24;
   const defaultPar = 3;
   const myArray = [
      { id: 0, par: defaultPar },
      { id: 1, par: defaultPar },
      { id: 2, par: defaultPar },
      { id: 3, par: defaultPar },
      { id: 4, par: defaultPar },
      { id: 5, par: defaultPar },
      { id: 6, par: defaultPar },
      { id: 7, par: defaultPar },
      { id: 8, par: defaultPar }
   ];

   //states
   const [holes, setHoles] = useState(myArray);

   useEffect(() => {
      console.log("holes", holes);
   }, [holes]);


   const sortCategoriesByName = () => {

   }

   const addHole = () => {
      let counter = holes.length;
      let newID = counter;

      if (counter == maxHoleCount) {
         //TODO: kieleistys
         alert("Rataan ei voi lisätä enempää väyliä kuin " + maxHoleCount);
         return;
      }

      //console.log("addhole", counter);
      let newHole = { id: newID, par: defaultPar }

      let newHoles = [];
      newHoles.push(newHole);

      setHoles(prevHoles => ([...prevHoles, ...newHoles]));
   }

   async function onSubmit(e) {
      e.preventDefault();

      if (holes.length < 1) {
         alert("Lisää vähintään yksi väylä");
         return;
      }

      try {
         //TODO: Tallenna rata ja reiät databaseen
      } catch (error) {
         console.log(error);
      }
   }

   const deleteHole = (holeID) => {
      //hävitä klikattu hole
      let filteredHoles = holes.filter(e => e.id != holeID);
      //luo uudet ID:t väylille
      let newHoles = [];
      for (let i = 0; i < filteredHoles.length; i++) {
         let newHole = { id: i, par: filteredHoles[i]["par"] };
         newHoles.push(newHole);
      }
      setHoles(newHoles);
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

            <Row>
               <ButtonGroup>
                  <Button text={t('button_add_holes')} iconName={Constants.ICON_PLUS}
                     type='button' onClick={() => addHole()} />
               </ButtonGroup>

               {holes != null && holes.length > 0 &&
                  <>
                     <TrackHoles holes={holes} deleteHole={deleteHole} setPar={setHoles} />
                  </>
               }
               <hr style={{ marginTop: '20px' }} />
               <ButtonGroup>
                  <Button type='submit' text={t('button_save_track')} className='btn btn-block saveBtn' />
               </ButtonGroup>
            </Row>
         </Form>
      </>
   )
}
