import Button from "../Buttons/Button";
import * as Constants from "../../utils/Constants";

export default function EventBands({ bands, onDelete }) {

  const showBandName = (band) => {
    return band.name;
  }

  const deleteBand = (band) => {
    const obj = { name: band.name, id: band.id };
    onDelete(obj);
  }

  return (
    <div>
      {bands != null && bands.map((band) => (
        <div key={band.id}>
          {showBandName(band)}
          &nbsp;
          <Button onClick={() => deleteBand(band)} text={'Delete'} color={Constants.COLOR_DELETEBUTTON} />
        </div>
      ))}
    </div>
  )
}