
export default function FoundBands({ bands, onSelection }) {

  return (
    <div>
      {bands != null && bands.slice(0, 3).map((band) => (
        <p key={band.id} onClick={onSelection(band.name)}>{band.name}</p>
      ))}
    </div>
  )
}