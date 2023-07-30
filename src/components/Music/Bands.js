import Band from './Band';

const Bands = ({ bands, onDelete, onEdit }) => {

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

export default Bands
