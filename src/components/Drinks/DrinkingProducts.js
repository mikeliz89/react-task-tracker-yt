//drinks
import DrinkingProduct from './DrinkingProduct';

export default function DrinkingProducts({ drinkingProducts, onDelete, onEdit }) {

    return (
        <>
            {drinkingProducts
                ? drinkingProducts.map((product, index) =>
                    <DrinkingProduct
                        key={product.id}
                        drinkingProduct={product}
                        onDelete={onDelete}
                        onEdit={onEdit} />
                ) : ''
            }
        </>
    )
}