import Counter from '../Site/Counter';

import Band from './Band';

export default function Bands({ items, onDelete, onEdit, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={items} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {items.map((band) => (
        <Band key={band.id}
          band={band}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}


