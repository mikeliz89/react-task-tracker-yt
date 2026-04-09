import Counter from '../Site/Counter';

import DrinkingProduct from './DrinkingProduct';

export default function DrinkingProducts({ drinkingProducts, originalList, counter, onDelete, onEdit }) {

    return (
        <>
            <Counter list={drinkingProducts} originalList={originalList} counter={counter} />
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

