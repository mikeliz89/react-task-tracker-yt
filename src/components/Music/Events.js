import Event from './Event';
import Counter from '../Site/Counter';

export default function Events({ events, onDelete, onEdit, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={events} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {events.map((event) => (
        <Event key={event.id}
          event={event}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}