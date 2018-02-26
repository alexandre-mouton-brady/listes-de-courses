import { Component } from 'inferno';
import { ListItem } from './ListItem';

export class List extends Component {
  state = {
    itemTitle: '',
    itemId: 0,
  };

  constructor(props) {
    super(props);

    this.addItem = this.addItem.bind(this);
    this.setItemTitle = this.setItemTitle.bind(this);
  }

  componentWillMount() {
    const { items } = this.props.list;
    const lastIndex = items.length - 1;

    this.setState({
      itemId: items.length === 0 ? 0 : items[lastIndex].id + 1,
    });
  }

  setItemTitle({ target: { value } }) {
    this.setState({ itemTitle: value });
  }

  addItem({ key }) {
    if (key !== 'Enter') return;

    const item = {
      id: this.state.itemId,
      title: this.state.itemTitle,
      done: false,
    };

    this.props.addListItem(item);
    this.setState(prev => ({ itemId: prev.itemId + 1, itemTitle: '' }));
  }

  render() {
    const { itemTitle } = this.state;
    const { addListItem, setItemTitle, addItem } = this;
    const { list, deleteList, deleteListItem, toggleDone } = this.props;

    return (
      <article className="list">
        <header className="list__header">
          <h3>{list.title}</h3>
          <button class="list__btn" onClick={deleteList}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </header>

        <main>
          <ul>
            {list.items.map(item => (
              <ListItem
                key={item.id}
                meta={item}
                deleteListItem={deleteListItem}
                toggleDone={toggleDone}
              />
            ))}
          </ul>
        </main>

        <footer className="list__footer">
          <input
            className="list__input"
            onInput={setItemTitle}
            onKeyPress={addItem}
            autocomplete="off"
            placeholder="Nouvel article... [Entrer pour valider]"
            value={itemTitle}
          />
        </footer>
      </article>
    );
  }
}
