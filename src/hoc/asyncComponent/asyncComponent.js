import React, { useEffect, useState } from 'react';

const asyncComponent = importComponent => {
  return props => {
    const initialState = {
      component: null,
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
      importComponent() // Importing component
        .then(cmp => {
          setState({ component: cmp.default }); // component default
        });
    }, []);

    const C = state.component;

    return C ? <C {...props} /> : null;
  };
};

export default asyncComponent;
