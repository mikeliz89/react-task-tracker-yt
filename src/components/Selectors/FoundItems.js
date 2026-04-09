import PropTypes from 'prop-types';

import { ICONS } from "../../utils/Constants";

import Button from "../Buttons/Button";

export default function FoundItems({ itemsToFind, nameField, onSelection, linkedName }) {

  const showName = (item) => {
    //TODO: lisää alaviiva nameen siihen kohtaan missä hakuehto toteutui
    return item[nameField];
}

  const setSelected = (item) => {
    const obj = { name: item[nameField], id: item.id };
    onSelection(obj);
  }

  return (
    <div>
      {itemsToFind != null && itemsToFind.slice(0, 3).map((item) => (
        <span key={item.id}>
          <Button key={item.id}
            iconName={ICONS.PLUS}
            onClick={() => setSelected(item)}
            text={showName(item)}
          />
          &nbsp;
        </span>
      ))}
    </div>
  )
}

FoundItems.defaultProps = {
  nameField: 'name'
}

FoundItems.propTypes = {
  nameField: PropTypes.string,
  itemsToFind: PropTypes.array,
  onSelection: PropTypes.func,
  linkedName: PropTypes.string
}



