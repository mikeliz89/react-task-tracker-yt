import Person from './Person';
import Counter from '../Site/Counter';

export default function PeopleList({ people, onDelete, originalList, counter }) {

    return (
        <div>
            {
                originalList != null && counter != null ? (
                    <Counter list={people} originalList={originalList} counter={counter} />
                ) : (<></>)
            }
            {people.map((person) => (
                <Person key={person.id} person={person} onDelete={onDelete} />
            ))}
        </div>
    )
}