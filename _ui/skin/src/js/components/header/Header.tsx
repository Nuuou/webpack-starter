import React, { useState } from 'react';

export default function () {
  const [searchVisible, setSearchVisible] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__container">
        <img src="https://via.placeholder.com/200x50" alt="" className="site-header__logo" />
        <div className="site-header__search">
          <button className="site-header__search-toggle" type="button" onClick={() => setSearchVisible(!searchVisible)}>Toggle</button>
          {searchVisible
            && (
            <form action="#" className="site-header__form">
              <input type="text" placeholder="Search..." />
              <button type="submit">Search</button>
            </form>
            )}
        </div>
      </div>
    </header>
  );
}
