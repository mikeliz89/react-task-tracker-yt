import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { TRANSLATION, DB } from "../../utils/Constants";
import useFetchById from '../Hooks/useFetchById';
import { GameConsoles } from './Categories';
import PropTypes from 'prop-types';

export default function AddGame({ gameID, onSave, onClose, showLabels }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.GAMES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [publishYear, setPublishYear] = useState(0);
    const [haveAtHome, setHaveAtHome] = useState(false);
    const [isDigital, setIsDigital] = useState(false);
    const [isCollectorsEdition, setIsCollectorsEdition] = useState(false);
    const [stars, setStars] = useState(0);

    const [console, setConsole] = useState();
    const [consoles, setConsoles] = useState(GameConsoles);

    //load data
    const gameData = useFetchById(DB.GAMES, gameID);

    useEffect(() => {
        if (gameData) {
            setCreated(gameData.created || '');
            setCreatedBy(gameData.createdBy || '');
            setDescription(gameData.description || '');
            setConsole(gameData.console || '');
            setHaveAtHome(gameData.haveAtHome || false);
            setName(gameData.name || '');
            setPublishYear(gameData.publishYear || 0);
            setIsDigital(gameData.isDigital || false);
            setStars(gameData.stars || 0);
        }
    }, [gameData]);

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

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave(gameID, {
            created, createdBy, description, console,
            haveAtHome, name, publishYear, isDigital, isCollectorsEdition,
            stars
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
                <Form.Group className="mb-3" controlId="addGameForm-IsCollectorsEdition">
                    <Form.Check
                        type='checkbox'
                        label={t('is_collectors_edition')}
                        checked={isCollectorsEdition}
                        value={isCollectorsEdition}
                        onChange={(e) => setIsCollectorsEdition(e.currentTarget.checked)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
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
