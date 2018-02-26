import { Component } from 'inferno';

export function Header({ lastModified, showDialog }) {
  const title = 'Listes de courses';
  const subtitle = `Dernières modifications : ${lastModified.getDay()}`;

  return (
    <header className="header">
      <h1 className="header__title">{title}</h1>
      <h2 className="header__subtitle">{subtitle}</h2>

      <button onClick={showDialog} className="header__btn">
        +
      </button>
    </header>
  );
}
