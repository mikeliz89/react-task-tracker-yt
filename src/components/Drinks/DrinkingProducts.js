import Counter from '../Site/Counter';

import DrinkingProduct from './DrinkingProduct';

export default function DrinkingProducts({ items, originalList, counter, onDelete, onEdit }) {

    return (
        <>
            <Counter list={items} originalList={originalList} counter={counter} />
            {items
                ? items.map((product, index) =>
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

