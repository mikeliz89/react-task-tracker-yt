import Counter from '../Site/Counter';

import Person from './Person';

export default function PeopleList({ items, onDelete, onEdit, originalList, counter }) {

    return (
        <div>
            {
                originalList != null && counter != null ? (
                    <Counter list={items} originalList={originalList} counter={counter} />
                ) : (<></>)
            }
            {items.map((person) => (
                <Person key={person.id}
                    person={person}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    )
}


