import Counter from '../Site/Counter';
import PropTypes from 'prop-types';

export default function ListMapper({ items = [], ItemComponent, originalList, counter, ...rest }) {
  return (
    <div>
      {originalList && counter && (
        <Counter list={items} originalList={originalList} counter={counter} />
      )}
      {items.map((item) => (
        <ItemComponent key={item.id} {...rest} {...{ [ItemComponent.name.toLowerCase()]: item }} />
      ))}
    </div>
  );
}

ListMapper.propTypes = {
  items: PropTypes.array,
  ItemComponent: PropTypes.elementType.isRequired,
  originalList: PropTypes.array,
  counter: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ]),
};
