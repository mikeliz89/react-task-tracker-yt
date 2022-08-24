//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button';
//recipe
import { RecipeCategories } from './Categories';

const AddRecipe = ({ recipeID, onAddRecipe, onClose }) => {

   const DB_RECIPES = '/recipes';

   //translation
   const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

   //states
   const [category, setCategory] = useState('');
   const [categories, setCategories] = useState(RecipeCategories);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [created, setCreated] = useState('');
   const [createdBy, setCreatedBy] = useState('');
   const [isCore, setIsCore] = useState(false);
   const [stars, setStars] = useState(0);

   useEffect(() => {
      if (recipeID != null) {
         const getRecipe = async () => {
            await fetchRecipeFromFirebase(recipeID)
         }
         getRecipe()
      }
   }, [recipeID]);

   useEffect(() => {
      sortCategoriesByName();
   }, []);

   /** get recipe from firebase by recipeID (in EDIT recipe) */
   const fetchRecipeFromFirebase = async (recipeID) => {

      const dbref = ref(db, `${DB_RECIPES}/${recipeID}`);
      get(dbref).then((snapshot) => {
         if (snapshot.exists()) {
            var val = snapshot.val();
            setTitle(val["title"]);
            setDescription(val["description"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setIsCore(val["isCore"]);
            setCategory(val["category"]);
            setStars(val["stars"]);
         }
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

   /** Recipe Form Submit */
   const onSubmit = (e) => {
      e.preventDefault()

      //validation
      if (!title) {
         alert(t('please_add_recipe'))
         return
      }

      onAddRecipe({ created, createdBy, title, description, category, isCore, stars });

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
            <Form.Group className="mb-3" controlId="addRecipeFormName">
               <Form.Label>{t('recipe_name')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={recipeID == null ? t('recipe_name') : t('edit_recipe_name')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addRecipeFormDescription">
               <Form.Label>{t('description')}</Form.Label>
               <Form.Control type='text'
                  autoComplete="off"
                  placeholder={recipeID == null ? t('add_description') : t('edit_description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addRecipeFormCategory">
               <Form.Label>{t('category')}</Form.Label>
               <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(({ id, name }) => (
                     <option value={id} key={id}>{t(`category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="AddRecipeFormIsCore">
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

export default AddRecipe
