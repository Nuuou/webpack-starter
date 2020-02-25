import React, { useState } from 'react';

interface ITsAppProps {
  test?: String
  whowhat: Number
}

export default function ({ test, whowhat } : ITsAppProps) {
  const modified = test?.split('').reverse().join('');
  const [number, numberCallback] = useState(0);

  const toggleBodyClass = () => {
    const bodyEl = document.body;
    if (bodyEl.classList.contains('thingy')) {
      bodyEl.classList.remove('thingy');
    } else {
      bodyEl.classList.add('thingy');
    }
  };

  return (
    <div className="coolthing">
      <p>wow!, {modified} is neat dude{whowhat}!</p>
      <p>{number}</p>
      <button type="button" onClick={() => numberCallback(number + 1)}>Increment!</button>
      <button type="button" onClick={toggleBodyClass}>Toggle Body Class</button>
    </div>
  );
}
