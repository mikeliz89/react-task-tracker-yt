import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Button from '../Buttons/Button';
import { RecipeCategories } from './Categories';
import { TRANSLATION, DB } from '../../utils/Constants';
import useFetchById from '../Hooks/useFetchById';

export default function AddRecipe({ recipeID, onSave, onClose, showLabels = true }) {

   // translations
   const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
   const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

   // default state
   const defaultRecipe = {
      title: '',
      description: '',
      category: '',
      created: '',
      createdBy: '',
      isCore: false,
      stars: 0,
      incredients: ''
   };

   const [recipe, setRecipe] = useState(defaultRecipe);

   // fetch existing recipe (if editing)
   const recipeData = useFetchById(DB.RECIPES, recipeID);

   useEffect(() => {
      if (recipeData) {
         setRecipe(prev => ({
            ...prev,
            ...recipeData
         }));
      }
   }, [recipeData]);

   // memoized category sorting
   const sortedCategories = useMemo(() => {
      return [...RecipeCategories].sort((a, b) => {
         const aName = t(`category_${a.name}`);
         const bName = t(`category_${b.name}`);
         return aName.localeCompare(bName);
      });
   }, [t]);

   const handleChange = (key, value) => {
      setRecipe(prev => ({ ...prev, [key]: value }));
   };

   const onSubmit = (e) => {
      e.preventDefault();

      if (!recipe.title.trim()) {
         alert(t('please_add_recipe'));
         return;
      }

      onSave(recipe);

      if (recipeID == null) {
         setRecipe(defaultRecipe);
      }
   };

   return (
      <Form onSubmit={onSubmit}>
         {/* Title */}
         <Form.Group className="mb-3" controlId="addRecipeForm-Title">
            {showLabels && <Form.Label>{t('recipe_name')}</Form.Label>}
            <Form.Control
               type="text"
               autoComplete="off"
               placeholder={recipeID == null ? t('recipe_name') : t('edit_recipe_name')}
               value={recipe.title}
               onChange={(e) => handleChange('title', e.target.value)}
            />
         </Form.Group>

         {/* Description */}
         <Form.Group className="mb-3" controlId="addRecipeForm-Description">
            {showLabels && <Form.Label>{t('description')}</Form.Label>}
            <Form.Control
               type="text"
               autoComplete="off"
               placeholder={recipeID == null ? t('add_description') : t('edit_description')}
               value={recipe.description}
               onChange={(e) => handleChange('description', e.target.value)}
            />
         </Form.Group>

         {/* Category */}
         <Form.Group className="mb-3" controlId="addRecipeForm-Category">
            {showLabels && <Form.Label>{t('category')}</Form.Label>}
            <Form.Select
               value={recipe.category}
               onChange={(e) => handleChange('category', e.target.value)}
            >
               {sortedCategories.map(({ id, name }) => (
                  <option key={id} value={id}>
                     {t(`category_${name}`)}
                  </option>
               ))}
            </Form.Select>
         </Form.Group>

         {/* Core checkbox */}
         <Form.Group className="mb-3" controlId="addRecipeForm-IsCore">
            <Form.Check
               type="checkbox"
               label={t('set_isCore')}
               checked={recipe.isCore}
               onChange={(e) => handleChange('isCore', e.currentTarget.checked)}
            />
         </Form.Group>

         {/* Buttons */}
         <Row>
            <ButtonGroup>
               <Button
                  type="button"
                  text={tCommon('buttons.button_close')}
                  className="btn btn-block"
                  onClick={onClose}
               />
               <Button
                  type="submit"
                  text={t('button_save_recipe')}
                  className="btn btn-block saveBtn"
               />
            </ButtonGroup>
         </Row>
      </Form>
   );
}

AddRecipe.propTypes = {
   recipeID: PropTypes.string,
   onSave: PropTypes.func.isRequired,
   onClose: PropTypes.func.isRequired,
   showLabels: PropTypes.bool
};
