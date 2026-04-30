import Counter from '../Site/Counter';

import Event from './Event';

export default function Events({ items, onDelete, onEdit, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={items} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {items.map((event) => (
        <Event key={event.id}
          event={event}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}


