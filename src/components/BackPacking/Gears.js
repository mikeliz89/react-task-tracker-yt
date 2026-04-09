import Counter from '../Site/Counter';

import Gear from './Gear';

export default function Gears({ gears, onDelete, originalList, counter }) {

    return (
        <div>
            {
                originalList != null && counter != null ? (
                    <Counter list={gears} originalList={originalList} counter={counter} />
                ) : (<></>)
            }
            {gears.map((gear) => (
                <Gear key={gear.id} gear={gear} onDelete={onDelete} />
            ))}
        </div>
    )
}


