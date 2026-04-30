import Counter from '../Site/Counter';

import Gear from './Gear';

export default function Gears({ items, onDelete, onEdit, originalList, counter }) {

    return (
        <div>
            {
                originalList != null && counter != null ? (
                    <Counter list={items} originalList={originalList} counter={counter} />
                ) : (<></>)
            }
            {items.map((gear) => (
                <Gear key={gear.id} gear={gear} onDelete={onDelete} onEdit={onEdit} />
            ))}
        </div>
    )
}


