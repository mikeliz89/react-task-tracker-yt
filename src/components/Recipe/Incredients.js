//react
import { useTranslation } from 'react-i18next';
//recipes
import { Incredient } from './Incredient';

export default function Incredients({ incredients, recipeID, onDelete }) {

  //translation
  const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

  return (
    <>
      <h5>{t('incredients_header')}</h5>

      {incredients
        ? incredients.map((incredient, index) =>
          <Incredient
            key={incredient.id}
            incredient={incredient}
            recipeID={recipeID}
            onDelete={onDelete} />
        ) : ''
      }
    </>
  )
}
