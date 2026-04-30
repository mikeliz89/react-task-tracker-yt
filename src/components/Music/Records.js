import Counter from '../Site/Counter';

import Record from './Record';

export default function Records({ items, onDelete, onEdit, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={items} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {items.map((record) => (
        <Record key={record.id}
          record={record}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}


