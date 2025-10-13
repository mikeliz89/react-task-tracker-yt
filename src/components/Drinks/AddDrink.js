import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { DrinkCategories } from './Categories';
import { TRANSLATION, DB } from '../../utils/Constants';
import PropTypes from 'prop-types';
import useFetchById from '../Hooks/useFetchById';

export default function AddDrink({ drinkID, onSave, onClose, showLabels }) {

   //translation
   const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });
   const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

   //states
   const [category, setCategory] = useState('');
   const [categories, setCategories] = useState(DrinkCategories);
   const [created, setCreated] = useState('');
   const [createdBy, setCreatedBy] = useState('');
   const [description, setDescription] = useState('');
   const [glass, setGlass] = useState('');
   const [incredients, setIncredients] = useState('');
   const [isCore, setIsCore] = useState(false);
   const [stars, setStars] = useState(0);
   const [title, setTitle] = useState('');

   //load data
   const drinkData = useFetchById(DB.DRINKS, drinkID);

   useEffect(() => {
      if (drinkData) {
         setCategory(drinkData.category || '');
         setCreated(drinkData.created || '');
         setCreatedBy(drinkData.createdBy || '');
         setDescription(drinkData.description || '');
         setGlass(drinkData.glass || '');
         setIncredients(drinkData.incredients || '');
         setIsCore(drinkData.isCore || false);
         setStars(drinkData.stars || 0);
         setTitle(drinkData.title || '');
      }
   }, [drinkData]);

   useEffect(() => {
      sortCategoriesByName();
   }, []);

   const sortCategoriesByName = () => {
      const sortedCategories = [...categories].sort((a, b) => {
         const aName = t(`category_${a.name}`);
         const bName = t(`category_${b.name}`);
         return aName > bName ? 1 : -1;
      });
      setCategories(sortedCategories);
   }

   const onSubmit = (e) => {
      e.preventDefault();

      //validation
      if (!title) {
         alert(t('please_add_drink'));
         return;
      }

      onSave({
         category, created, createdBy,
         description, glass, isCore, incredients,
         stars, title
      });

      if (drinkID == null) {
         clearForm();
      }
   }

   const clearForm = () => {
      setTitle('');
      setDescription('');
      setGlass('');
      setIsCore(false);
   }

   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addDrinkForm-Name">
               {showLabels && <Form.Label>{t('name')}</Form.Label>}
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={drinkID == null ? t('name') : t('name')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Description">
               {showLabels && <Form.Label>{t('description')}</Form.Label>}
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={drinkID == null ? t('description') : t('description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Glass">
               {showLabels && <Form.Label>{t('glass')}</Form.Label>}
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={drinkID == null ? t('glass') : t('glass')}
                  value={glass}
                  onChange={(e) => setGlass(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkForm-Category">
               {showLabels && <Form.Label>{t('category')}</Form.Label>}
               <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(({ id, name }) => (
                     <option value={id} key={id}>{t(`category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="AddDrinkForm-IsCore">
               <Form.Check
                  type='checkbox'
                  label={t('set_isCore')}
                  checked={isCore}
                  value={isCore}
                  onChange={(e) => setIsCore(e.currentTarget.checked)} />
            </Form.Group>
            <Row>
               <ButtonGroup>
                  <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block'
                     onClick={() => onClose()} />
                  <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
               </ButtonGroup>
            </Row>
         </Form>
         {/* TODO rakenna linkin lisäys jo drinkin lisäykseen <AddLink onSaveLink={saveLink} /> */}
      </>
   )
}

AddDrink.defaultProps = {
   showLabels: true
}

AddDrink.propTypes = {
   showLabels: PropTypes.bool
}