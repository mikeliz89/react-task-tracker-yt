import Band from './Band';
import Counter from '../Site/Counter';

export default function Bands({ bands, onDelete, onEdit, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={bands} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {bands.map((band) => (
        <Band key={band.id}
          band={band}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}