import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const EditIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path d="M3 21h3.75L17.81 9.94a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0L3 17.25V21zm2-2v-1.34L14.06 7.6l1.34 1.34L6.34 19H5zm13.71-14.04l1.34 1.34a1 1 0 010 1.41l-1.18 1.18-2.34-2.34 1.18-1.18a1 1 0 011.41 0z" />
  </Svg>
);

export default EditIcon;
