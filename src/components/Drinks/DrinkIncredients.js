import { useTranslation } from 'react-i18next';
import DrinkIncredient from './DrinkIncredient';

export default function DrinkIncredients({ drinkIncredients, onDelete }) {

    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    return (
        <>
            {drinkIncredients
                ? drinkIncredients.map((incredient, index) =>
                    <DrinkIncredient
                        key={incredient.id}
                        drinkIncredient={incredient}
                        onDelete={onDelete} />
                ) : ''
            }
        </>
    )
}