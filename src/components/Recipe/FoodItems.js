import FoodItem from './FoodItem';
import Counter from '../Site/Counter';

export default function FoodItems({ foodItems, onDelete, onEdit, originalList, counter }) {

    return (
        <>
            {
                originalList != null && counter != null ? (
                    <Counter list={foodItems} originalList={originalList} counter={counter} />
                ) : (<></>)
            }
            {foodItems
                ? foodItems.map((foodItem, index) =>
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