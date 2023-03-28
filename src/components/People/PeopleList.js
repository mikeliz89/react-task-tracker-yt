import Person from './Person';

export const PeopleList = ({ people, onDelete }) => {

    return (
        <div>
            {people.map((person) => (
                <Person key={person.id} person={person} onDelete={onDelete} />
            ))}
        </div>
    )
}

export default PeopleList