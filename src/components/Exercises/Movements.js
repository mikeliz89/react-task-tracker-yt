import Counter from '../Site/Counter';

import Movement from './Movement';

export default function Movements({ movements, originalList, counter, onDelete }) {

    return (
        <div>
            <Counter list={movements} originalList={originalList} counter={counter} />
            {movements.map((movement) => (
                <Movement key={movement.id} movement={movement} onDelete={onDelete} />
            ))}
        </div>
    )
}

