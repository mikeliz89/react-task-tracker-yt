import Counter from '../Site/Counter';

import FoodItem from './FoodItem';

export default function FoodItems({ items, onDelete, onEdit, originalList, counter }) {

    return (
        <>
            {
                originalList != null && counter != null ? (
                    <Counter list={items} originalList={originalList} counter={counter} />
                ) : (<></>)
            }
            {items
                ? items.map((foodItem, index) =>
                    <FoodItem
                        key={foodItem.id}
                        foodItem={foodItem}
                        onDelete={onDelete}
                        onEdit={onEdit} />
                ) : ''
            }
        </>
    )
}


