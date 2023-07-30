import Event from './Event';

const Events = ({ events, onDelete, onEdit }) => {

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

export default Events
