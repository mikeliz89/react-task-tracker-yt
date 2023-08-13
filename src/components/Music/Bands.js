import Band from './Band';

export default function Bands({ bands, onDelete, onEdit }) {

  return (
    <div>
      {bands.map((band) => (
        <Band key={band.id}
          band={band}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}