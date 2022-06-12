//react
import { useTranslation } from 'react-i18next';
//drinks
import DrinkingProduct from './DrinkingProduct';

export default function DrinkingProducts({ drinkingProducts, onDelete }) {

    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    return (
        <>
            {drinkingProducts
                ? drinkingProducts.map((product, index) =>
                    <DrinkingProduct
                        key={product.id}
                        drinkingProduct={product}
                        onDelete={onDelete} />
                ) : ''
            }
        </>
    )
}