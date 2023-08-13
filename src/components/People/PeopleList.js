import Person from './Person';

export default function PeopleList({ people, onDelete }) {

    return (
        <div>
            {people.map((person) => (
                <Person key={person.id} person={person} onDelete={onDelete} />
            ))}
        </div>
    )
}