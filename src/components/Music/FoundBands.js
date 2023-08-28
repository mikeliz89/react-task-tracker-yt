import Button from "../Buttons/Button";
import * as Constants from "../../utils/Constants";

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
        <>
          <Button key={band.id}
            iconName={Constants.ICON_PLUS}
            onClick={() => setSelected(band)}
            text={showBandName(band)}
          />
          &nbsp;
        </>
      ))}
    </div>
  )
}