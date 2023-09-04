import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';
import GoBackButton from '../Buttons/GoBackButton';
import TrackHoles from './TrackHoles';
import { pushToFirebase, pushToFirebaseChild } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../Site/PageTitle';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';

export default function CreateTrack() {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

   //constants
   const maxHoleCount = 24;
   const defaultPar = 3;
   const minPar = 2;
   const maxPar = 6;

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
   const [trackName, setTrackName] = useState('');
   const [trackCity, setTrackCity] = useState('');
   const [description, setDescription] = useState('');
   const [holes, setHoles] = useState(myArray);

   //navigation
   const navigate = useNavigate();

   //auth
   const { currentUser } = useAuth();

   //alert
   const [showMessage, setShowMessage] = useState(false);
   const [message] = useState('');
   const [showError, setShowError] = useState(false);
   const [error, setError] = useState('');

   //listen to holes changes
   useEffect(() => {
      //console.log("holes", holes);
   }, [holes]);

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

      if (trackName === "") {
         alert("Ole hyvä ja anna radalle nimi");
         return;
      }

      try {
         console.log("Saving track");
         saveTrack({ trackName, trackCity, description });

      } catch (error) {
         console.log(error);
      }
   }

   const saveTrack = async (track) => {
      try {
         track["created"] = getCurrentDateAsJson();
         track["createdBy"] = currentUser.email;
         const key = await pushToFirebase(Constants.DB_DISC_GOLF_TRACKS, track);

         saveHoles(key);

         navigate(`${Constants.NAVIGATION_MANAGE_DISC_GOLF_TRACKS}`);
      } catch (ex) {
         setError(t('track_save_exception'));
         setShowError(true);
      }
   }

   const saveHoles = async (trackID) => {
      await pushToFirebaseChild(Constants.DB_DISC_GOLF_TRACK_HOLES, trackID, holes);
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

   const increasePar = (holeID) => {
      const newHoles = holes.map(hole => {
         if (hole.id === holeID) {
            if (hole.par < maxPar) {
               hole.par = hole.par + 1;
               return hole;
            }
         }
         return hole;
      });
      // Re-render with the new array
      setHoles(newHoles);
   }

   const decreasePar = (holeID) => {
      const newHoles = holes.map(hole => {
         if (hole.id === holeID) {
            if (hole.par > minPar) {
               hole.par = hole.par - 1;
               return hole;
            }
         }
         return hole;
      });
      // Re-render with the new array
      setHoles(newHoles);
   }

   return (
      <PageContentWrapper>

         <PageTitle title={t('add_new_track')} />

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
            <Form.Group className="mb-3" controlId="createTrackForm-City">
               <Form.Label>{t('track_city')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={t('track_city')}
                  value={trackCity}
                  onChange={(e) => setTrackCity(e.target.value)} />
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
                     <CenterWrapper>{t('holes') + ': '}{holes.length}</CenterWrapper>
                     <TrackHoles holes={holes} deleteHole={deleteHole}
                        increasePar={increasePar} decreasePar={decreasePar}
                     />
                  </>
               }
               <hr style={{ marginTop: '20px' }} />
               <ButtonGroup>
                  <Button type='submit' text={t('button_save_track')} className='btn btn-block saveBtn' />
               </ButtonGroup>
            </Row>
         </Form>
      </PageContentWrapper>
   )
}
