import Record from './Record';

export default function Records({ records, onDelete, onEdit }) {

  return (
    <div>
      {records.map((record) => (
        <Record key={record.id}
          record={record}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}