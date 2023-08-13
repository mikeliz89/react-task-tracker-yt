import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form, Col } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from "../../utils/Constants";
import { getFromFirebaseById } from '../../datatier/datatier';
import { MovieFormats } from './Categories';
import PropTypes from 'prop-types';

export default function AddMovie({ movieID, onSave, onClose, showLabels }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [nameFi, setNameFi] = useState('');
    const [description, setDescription] = useState('');
    const [publishYear, setPublishYear] = useState(0);
    const [haveAtHome, setHaveAtHome] = useState(false);

    const [format, setFormat] = useState();
    const [formats, setFormats] = useState(MovieFormats);

    //load data
    useEffect(() => {
        if (movieID != null) {
            const getMovie = async () => {
                await fetchMovieFromFirebase(movieID);
            }
            getMovie();
        }
    }, [movieID]);

    useEffect(() => {
        sortFormatsByName();
    }, []);

    const sortFormatsByName = () => {
        const sorted = [...formats].sort((a, b) => {
            const aName = t(`movie_format_${a.name}`);
            const bName = t(`movie_format_${b.name}`);
            return aName > bName ? 1 : -1;
        });
        setFormats(sorted);
    }

    const fetchMovieFromFirebase = async (movieID) => {
        getFromFirebaseById(Constants.DB_MOVIES, movieID).then((val) => {
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setDescription(val["description"]);
            setFormat(val["format"]);
            setHaveAtHome(val["haveAtHome"]);
            setName(val["name"]);
            setNameFi(val["nameFi"]);
            setPublishYear(val["publishYear"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave(movieID, {
            created, createdBy, description, format,
            haveAtHome, name, nameFi, publishYear
        });

        if (movieID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setDescription('');
        setName('');
        setNameFi('');
        setPublishYear(0);
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addMovieForm-Name">
                    {showLabels && <Form.Label>{t('name')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMovieForm-NameFi">
                    {showLabels && <Form.Label>{t('name_fi')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('name_fi')}
                        value={nameFi}
                        onChange={(e) => setNameFi(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMovieForm-PublishYear">
                    {showLabels && <Form.Label>{t('publish_year')}</Form.Label>}
                    <Form.Control type='number' step='any'
                        autoComplete="off"
                        placeholder={t('publish_year')}
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMovieForm-Category">
                    {showLabels && <Form.Label>{t('format')}</Form.Label>}
                    <Form.Select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}>
                        {formats.map(({ id, name }) => (
                            <option value={id} key={id}>{t(`movie_format_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMovieForm-Description">
                    {showLabels && <Form.Label>{t('description')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMovieForm-HaveAtHome">
                    <Form.Check
                        type='checkbox'
                        label={t('have')}
                        checked={haveAtHome}
                        value={haveAtHome}
                        onChange={(e) => setHaveAtHome(e.currentTarget.checked)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_movie')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
            {/* TODO rakenna linkin lisäys jo personin lisäykseen <AddLink onSaveLink={saveLink} /> */}
        </>
    )
}

AddMovie.defaultProps = {
    showLabels: true
}

AddMovie.propTypes = {
    showLabels: PropTypes.bool
}