import Counter from '../Site/Counter';

import Movement from './Movement';

export default function Movements({ items, originalList, counter, onDelete }) {

    return (
        <div>
            <Counter list={items} originalList={originalList} counter={counter} />
            {items.map((movement) => (
                <Movement key={movement.id} movement={movement} onDelete={onDelete} />
            ))}
        </div>
    )
}

