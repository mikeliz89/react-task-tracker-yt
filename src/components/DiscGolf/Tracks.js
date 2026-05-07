import Track from "./Track";

import Counter from '../Site/Counter';

export default function Tracks({ items, originalList, counter, onDelete }) {

    return (
        <div>
            {
                originalList != null && counter != null ? (
                    <Counter list={items} originalList={originalList} counter={counter} />
                ) : (<></>)
            }
            {items.map((track) => (
                <Track key={track.id} track={track} onDelete={onDelete} />
            ))}
        </div>
    )
}

