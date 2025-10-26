import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form, Col } from 'react-bootstrap';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import PageContentWrapper from '../Site/PageContentWrapper';
import GoBackButton from '../Buttons/GoBackButton';
import useFetch from '../Hooks/useFetch';
import { useRef } from 'react';
import Button from '../Buttons/Button';
import FoundItems from '../Selectors/FoundItems';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { pushToFirebase, pushToFirebaseChild } from '../../datatier/datatier';
import { useAlert } from '../Hooks/useAlert';

export default function StartNewRound() {

   //translation
   const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });

   //fetch tracks
   const { originalData: originalTracks } = useFetch(DB.DISC_GOLF_TRACKS);

   //fetch people for players
   const { originalData: originalPeople } = useFetch(DB.PEOPLE);

   //states for tack
   const [linkedTrackName, setLinkedTrackName] = useState('');
   const [foundTracks, setFoundTracks] = useState([]);
   const [selectedTrack, setSelectedTrack] = useState(null);

   //states for player
   const [linkedPlayerName, setLinkedPlayerName] = useState('');
   const [foundPlayers, setFoundPlayers] = useState([]);
   const [selectedPlayers, setSelectedPlayers] = useState([]);

   //navigation
   const navigate = useNavigate();

   //auth
   const { currentUser } = useAuth();

   //alert
   const {
      message, setMessage,
      showMessage, setShowMessage,
      error, setError,
      showError, setShowError,
      clearMessages,
      showSuccess,
      showFailure
   } = useAlert();

   const inputRef = useRef();
   const inputPlayerRef = useRef();

   //listen for track selection
   useEffect(() => {

      if (linkedTrackName === "") {
         setFoundTracks(Object.values(originalTracks));
      } else {
         var filtered =
            Object.values(originalTracks).filter(
               e => e.trackName != null && e.trackName.toLowerCase().includes(linkedTrackName.toLowerCase())
            );
         setFoundTracks(filtered);
      }
   }, [linkedTrackName]);

   //listen for player selections
   useEffect(() => {

      if (linkedPlayerName === "") {
         setFoundPlayers(Object.values(originalPeople));
      } else {
         var filtered =
            Object.values(originalPeople).filter(
               e => e.name != null && e.name.toLowerCase().includes(linkedPlayerName.toLowerCase())
            );
         setFoundPlayers(filtered);
      }
   }, [linkedPlayerName]);

   async function onSubmit(e) {
      e.preventDefault();

      if (selectedTrack == null) {
         alert(t('alert_you_have_to_choose_track'));
         return;
      }

      if (selectedPlayers == null || selectedPlayers.length < 1) {
         alert(t('alert_choose_at_last_one_player'));
         return;
      }

      saveRound(selectedTrack);
   }

   const saveRound = async (track) => {
      try {
         var round = {};
         round["created"] = getCurrentDateAsJson();
         round["createdBy"] = currentUser.email;
         round["trackID"] = track.id;
         round["trackName"] = track.name;
         const key = await pushToFirebase(DB.DISC_GOLF_ROUNDS, round);

         savePlayers(key);

         navigate(`${NAVIGATION.DISC_GOLF_PLAY_ROUND}`);
      } catch (ex) {
         showFailure(t('track_save_exception'));
         console.warn(ex);
      }
   }

   const savePlayers = async (roundID) => {
      await pushToFirebaseChild(DB.DISC_GOLF_ROUND_PLAYERS, roundID, selectedPlayers);
   }

   const selectedTrackChanged = (track) => {
      setSelectedTrack(track);
   }

   const selectedPlayerChanged = (player) => {
      if (selectedPlayers.filter(x => x.id === player.id).length < 1) {
         var result = [...selectedPlayers, { ...player }];
         setSelectedPlayers(result);
      }
   }

   const deletePlayer = (playerID) => {
      var newPlayerArray = selectedPlayers.filter(x => x.id !== playerID);
      setSelectedPlayers(newPlayerArray);
   }

   return (
      <PageContentWrapper>

         <Row>
            <ButtonGroup>
               <GoBackButton />
            </ButtonGroup>
         </Row>

         <>
            <Form onSubmit={e => { e.preventDefault(); }} style={{ paddingBottom: 0 }}>
               <Form.Group className="mb-3" controlId="startNewRound-Track">
                  <Form.Label>{t('choose_track')}</Form.Label>
                  <Form.Control type='text'
                     ref={inputRef}
                     autoComplete="off"
                     placeholder={t('track_name')}
                     value={linkedTrackName}
                     onChange={(e) => setLinkedTrackName(e.target.value)} />
               </Form.Group>
            </Form>
            <FoundItems itemsToFind={foundTracks}
               nameField='trackName'
               onSelection={selectedTrackChanged} linkedName={linkedTrackName} />
         </>

         {selectedTrack != null &&
            <p>{t('chosen_track') + ': '}{selectedTrack.name}</p>
         }

         <>
            <Form onSubmit={e => { e.preventDefault(); }} style={{ paddingBottom: 0 }}>
               <Form.Group className="mb-3" controlId="startNewRound-Players">
                  <Form.Label>{t('choose_players')}</Form.Label>
                  <Form.Control type='text'
                     ref={inputPlayerRef}
                     autoComplete="off"
                     placeholder={t('player_name')}
                     value={linkedPlayerName}
                     onChange={(e) => setLinkedPlayerName(e.target.value)} />
               </Form.Group>
            </Form>
            <FoundItems itemsToFind={foundPlayers}
               nameField='name'
               onSelection={selectedPlayerChanged} linkedName={linkedPlayerName} />
         </>

         {
            selectedPlayers != null && selectedPlayers.length > 0 &&
            <>
               <p>{t('chosen_players') + ': '}</p>
               {/* <p>{JSON.stringify(selectedPlayers)}</p> */}
               {
                  selectedPlayers.map((player) => (
                     <Row key={player.id}>
                        <Col>{player.name}</Col>
                        <Col>
                           {<Button onClick={() => deletePlayer(player.id)} iconName={ICONS.DELETE} />}
                        </Col>
                     </Row>
                  ))
               }
            </>
         }

         <Form onSubmit={onSubmit}>
            <Row>
               <ButtonGroup>
                  <Button type='submit' text={t('button_start_round')} className='btn btn-block saveBtn' />
               </ButtonGroup>
            </Row>
         </Form>

      </PageContentWrapper >
   )
}
