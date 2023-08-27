
export default function FoundBands({ bands, onSelection, linkedBandName }) {

  const showBandName = (band) => {
    return band.name;
  }

  const setSelected = (band) => {
    const obj = { name: band.name, id: band.id };
    onSelection(obj);
  }

  return (
    <div>
      {bands != null && bands.slice(0, 3).map((band) => (
        <div key={band.id} onClick={() => setSelected(band)}>
          {showBandName(band)}
        </div>
      ))}
    </div>
  )
}