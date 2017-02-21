import React, { PropTypes } from 'react';
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
    noResultsOrLoading = <div className="loader">loading...</div>;
  } else if (items.length === 0) {
    noResultsOrLoading = (
      <p className="no-items">
        No results are available for your search.
        <br />
        Try searching again by Neighbourhood, City or Country.
      </p>
    );
  }

  return (
    <div className="cards-container-component">
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
