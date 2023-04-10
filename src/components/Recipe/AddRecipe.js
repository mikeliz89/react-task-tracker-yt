import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { RecipeCategories } from './Categories';
import * as Constants from '../../utils/Constants';
import { getFromFirebaseById } from '../../datatier/datatier';
import PropTypes from 'prop-types';

const AddRecipe = ({ recipeID, onSave, onClose, showLabels }) => {

   //translation
   const { t } = useTranslation(Constants.TRANSLATION_RECIPE, { keyPrefix: Constants.TRANSLATION_RECIPE });

   //states
   const [category, setCategory] = useState('');
   const [categories, setCategories] = useState(RecipeCategories);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [created, setCreated] = useState('');
   const [createdBy, setCreatedBy] = useState('');
   const [isCore, setIsCore] = useState(false);
   const [stars, setStars] = useState(0);
   const [incredients, setIncredients] = useState('');

   useEffect(() => {
      sortCategoriesByName();
   }, []);

   useEffect(() => {
      if (recipeID != null) {
         const getRecipe = async () => {
            await fetchRecipeFromFirebase(recipeID);
         }
         getRecipe();
      }
   }, [recipeID]);

   const fetchRecipeFromFirebase = async (recipeID) => {
      getFromFirebaseById(Constants.DB_RECIPES, recipeID).then((val) => {
         setCategory(val["category"]);
         setCreated(val["created"]);
         setCreatedBy(val["createdBy"]);
         setDescription(val["description"]);
         setIncredients(val["incredients"]);
         setIsCore(val["isCore"]);
         setStars(val["stars"]);
         setTitle(val["title"]);
      });
   }

   const sortCategoriesByName = () => {
      const sortedCategories = [...categories].sort((a, b) => {
         const aName = t(`category_${a.name}`);
         const bName = t(`category_${b.name}`);
         return aName > bName ? 1 : -1;
      });
      setCategories(sortedCategories);
   }

   const onSubmit = (e) => {
      e.preventDefault()

      //validation
      if (!title) {
         alert(t('please_add_recipe'))
         return
      }

      onSave({ category, created, createdBy, description, incredients, isCore, stars, title });

      if (recipeID == null) {
         clearForm();
      }
   }

   const clearForm = () => {
      setTitle('');
      setDescription('');
      setIsCore(false);
      setCategory('');
   }

   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addRecipeForm-Name">
               {showLabels && <Form.Label>{t('recipe_name')}</Form.Label>}
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={recipeID == null ? t('recipe_name') : t('edit_recipe_name')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addRecipeForm-Description">
               {showLabels && <Form.Label>{t('description')}</Form.Label>}
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={recipeID == null ? t('add_description') : t('edit_description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addRecipeForm-Category">
               {showLabels && <Form.Label>{t('category')}</Form.Label>}
               <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(({ id, name }) => (
                     <option value={id} key={id}>{t(`category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="addRecipeForm-IsCore">
               <Form.Check
                  type='checkbox'
                  label={t('set_isCore')}
                  checked={isCore}
                  value={isCore}
                  onChange={(e) => setIsCore(e.currentTarget.checked)} />
            </Form.Group>
            <Row>
               <ButtonGroup>
                  <Button type='button' text={t('button_close')} className='btn btn-block'
                     onClick={() => onClose()} />
                  <Button type='submit' text={t('button_save_recipe')} className='btn btn-block saveBtn' />
               </ButtonGroup>
            </Row>
         </Form>
      </>
   )
}

AddRecipe.defaultProps = {
   showLabels: true
}

AddRecipe.propTypes = {
   showLabels: PropTypes.bool
}

export default AddRecipe
