import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { GearCategories } from './Categories';
import * as Constants from "../../utils/Constants";
import { getFromFirebaseById } from '../../datatier/datatier';

export default function AddGear({ gearID, onSave, onClose }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //states
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState(GearCategories);
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [weightInGrams, setWeightInGrams] = useState(0);
    const [stars, setStars] = useState(0);
    const [description, setDescription] = useState('');

    //load data
    useEffect(() => {
        if (gearID != null) {
            const getGear = async () => {
                await fetchGearFromFirebase(gearID);
            }
            getGear();
        }
    }, [gearID]);

    useEffect(() => {
        const sortCategoriesByName = () => {
            const sortedCategories = [...categories].sort((a, b) => {
                const aName = t(`gear_category_${a.name}`);
                const bName = t(`gear_category_${b.name}`);
                return aName > bName ? 1 : -1;
            });
            setCategories(sortedCategories);
        }
        sortCategoriesByName();
    }, [categories, t]);

    const fetchGearFromFirebase = async (gearID) => {
        getFromFirebaseById(Constants.DB_BACKPACKING_GEAR, gearID).then((val) => {
            setCategory(val["category"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setDescription(val["description"]);
            setName(val["name"]);
            setWeightInGrams(val["weightInGrams"]);
            setStars(val["stars"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_gear'));
            return;
        }

        onSave({ created, createdBy, description, name, category, weightInGrams, stars });

        if (gearID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setCategory('');
        setDescription('');
        setName('');
        setWeightInGrams(0);
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addGearForm-Name">
                    <Form.Label>{t('gear_name')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('gear_name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGearForm-Description">
                    <Form.Label>{t('gear_description')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('gear_description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGearForm-WeightInGrams">
                    <Form.Label>{t('gear_weight_in_grams')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('gear_weight_in_grams')}
                        value={weightInGrams}
                        onChange={(e) => setWeightInGrams(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGearForm-Category">
                    <Form.Label>{t('gear_category')}</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(({ id, name }) => (
                            <option value={id} key={id}>{t(`gear_category_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_gear')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
            {/* TODO rakenna linkin lisäys jo gearin lisäykseen <AddLink onSaveLink={saveLink} /> */}
        </>
    )
}