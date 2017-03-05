import React from 'react';
import ReactSpinner from 'react-spinjs';

//------------------------------------------------------------------------------
// STYLES:
//------------------------------------------------------------------------------
// See https://github.com/qimingweng/react-spinjs
const styles = {
  spinner: {
    lines: 12, // The number of lines to draw
    length: 20, // The length of each line
    width: 8, // The line thickness
    radius: 20, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#009fe8', // #rgb or #rrggbb or array of colors
    opacity: 0.45, // Opacity of the lines
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    speed: 1, // Rounds per second
    trail: 48, // Afterglow percentage
    fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    position: 'absolute', // Element positioning
  },
};
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
/**
* @summary Dumb component; displays loading spinner.
* @example <Spinner />
*/
const Spinner = () => (
  <ReactSpinner config={styles.spinner} />
);

export default Spinner;
