import Counter from '../Site/Counter';
import PropTypes from 'prop-types';

export default function ListMapper({ items = [], ItemComponent, originalList, counter, title, ...rest }) {
  const getItemPropName = (Component) => {
    const name = Component?.displayName || Component?.name || '';
    return name.toLowerCase();
  };

  const itemPropName = getItemPropName(ItemComponent);

  return (
    <div>
      {originalList && counter && (
        <Counter list={items} originalList={originalList} counter={counter} text={title} />
      )}
      {items.map((item) => (
        <ItemComponent
          key={item.id}
          {...rest}
          item={item}
          {...(itemPropName ? { [itemPropName]: item } : {})}
        />
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
