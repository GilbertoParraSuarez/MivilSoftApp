import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const DeleteIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path d="M9 3h6a1 1 0 011 1v1h4v2h-1v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3V5h4V4a1 1 0 011-1zm6 2H9v1h6zM7 7v13h10V7zm2 2h2v9H9zm4 0h2v9h-2z"/>
  </Svg>
);

export default DeleteIcon;
