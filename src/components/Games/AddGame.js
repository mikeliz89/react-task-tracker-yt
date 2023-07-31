import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from "../../utils/Constants";
import { getFromFirebaseById } from '../../datatier/datatier';
import { GameConsoles } from './Categories';
import PropTypes from 'prop-types';

const AddGame = ({ gameID, onSave, onClose, showLabels }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_GAMES, { keyPrefix: Constants.TRANSLATION_GAMES });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [publishYear, setPublishYear] = useState(0);
    const [haveAtHome, setHaveAtHome] = useState(false);
    const [isDigital, setIsDigital] = useState(false);
    const [isCollectorsEdition, setIsCollectorsEdition] = useState(false);

    const [console, setConsole] = useState();
    const [consoles, setConsoles] = useState(GameConsoles);

    //load data
    useEffect(() => {
        if (gameID != null) {
            const getGame = async () => {
                await fetchGameFromFirebase(gameID);
            }
            getGame();
        }
    }, [gameID]);

    useEffect(() => {
        sortConsolesByName();
    }, []);

    const sortConsolesByName = () => {
        const sorted = [...consoles].sort((a, b) => {
            const aName = t(`game_console_${a.name}`);
            const bName = t(`game_console_${b.name}`);
            return aName > bName ? 1 : -1;
        });
        setConsoles(sorted);
    }

    const fetchGameFromFirebase = async (gameID) => {
        getFromFirebaseById(Constants.DB_GAMES, gameID).then((val) => {
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setDescription(val["description"]);
            setConsole(val["console"]);
            setHaveAtHome(val["haveAtHome"]);
            setName(val["name"]);
            setPublishYear(val["publishYear"]);
            setIsDigital(val["isDigital"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave(gameID, {
            created, createdBy, description, console,
            haveAtHome, name, publishYear, isDigital, isCollectorsEdition
        });

        if (gameID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setDescription('');
        setName('');
        setPublishYear(0);
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addGameForm-Name">
                    {showLabels && <Form.Label>{t('name')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGameForm-PublishYear">
                    {showLabels && <Form.Label>{t('publish_year')}</Form.Label>}
                    <Form.Control type='number' step='any'
                        autoComplete="off"
                        placeholder={t('publish_year')}
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGameForm-Console">
                    {showLabels && <Form.Label>{t('console')}</Form.Label>}
                    <Form.Select
                        value={console}
                        onChange={(e) => setConsole(e.target.value)}>
                        {consoles.map(({ id, name }) => (
                            <option value={id} key={id}>{t(`game_console_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGameForm-Description">
                    {showLabels && <Form.Label>{t('description')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGameForm-HaveAtHome">
                    <Form.Check
                        type='checkbox'
                        label={t('have')}
                        checked={haveAtHome}
                        value={haveAtHome}
                        onChange={(e) => setHaveAtHome(e.currentTarget.checked)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGameForm-IsDigital">
                    <Form.Check
                        type='checkbox'
                        label={t('is_digital')}
                        checked={isDigital}
                        value={isDigital}
                        onChange={(e) => setIsDigital(e.currentTarget.checked)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_game')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
            {/* TODO rakenna linkin lisäys jo personin lisäykseen <AddLink onSaveLink={saveLink} /> */}
        </>
    )
}

AddGame.defaultProps = {
    showLabels: true
}

AddGame.propTypes = {
    showLabels: PropTypes.bool
}

export default AddGame
