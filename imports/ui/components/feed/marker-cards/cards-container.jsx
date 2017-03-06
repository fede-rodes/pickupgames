import React, { PropTypes } from 'react';
import { Alert } from 'antd';
import MarkerCard from './marker-card.jsx';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @see {@link https://www.youtube.com/watch?v=FyUP4qvoroU}
*/
const CardsContainer = ({ items, itemsReady, onItemClick }) => {
  // Items are ready. Make a card for each of them
  const cards = items.length > 0 && items.map((item, index) => (
    <MarkerCard
      key={index}
      data={item}
      onClick={onItemClick}
    />
  )) || [];

  // No results text or loading indicator
  let noResultsOrLoading = null;
  if (!itemsReady) {
    noResultsOrLoading = <div>loading...</div>;
  } else if (items.length === 0) {
    noResultsOrLoading = (
      <Alert
        message="No results are available for your search."
        description="Try searching again by City, Neighbourhood or Postcode."
        type="info"
        showIcon
      />
    );
  }

  return (
    <div>
      {cards}
      {noResultsOrLoading}
    </div>
  );
};

CardsContainer.propTypes = {
  items: PropTypes.array.isRequired,
  itemsReady: PropTypes.bool.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default CardsContainer;
