import Counter from '../Site/Counter';

import Record from './Record';

export default function Records({ records, onDelete, onEdit, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={records} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {records.map((record) => (
        <Record key={record.id}
          record={record}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}


