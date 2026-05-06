import Track from "./Track";

import Counter from '../Site/Counter';

export default function Tracks({ items, originalList, counter, onDelete }) {


    // Counter-komponentti näkyviin kuten Games.js
    // Huom: oletetaan että propsina tulee myös originalList ja counter

    return (
        <>
            {originalList != null && counter != null ? (
                <Counter list={items} originalList={originalList} counter={counter} />
            ) : null}
            {items.map((track) => (
                <Track key={track.id} track={track} onDelete={onDelete} />
            ))}
        </>
    )
}

