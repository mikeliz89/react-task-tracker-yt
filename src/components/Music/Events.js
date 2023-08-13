import Event from './Event';

export default function Events({ events, onDelete, onEdit }) {

  return (
    <div>
      {events.map((event) => (
        <Event key={event.id}
          event={event}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}