import { Component } from 'inferno';
import { Header } from './components/Header';
import { List } from './components/List';
import { Dialog } from './components/Dialog';

export class App extends Component {
  state = {
    lastModified: new Date(),
    lists: [],
    id: 0,
    showDialog: false,
    dialogType: 'list',
  };

  constructor() {
    super();

    this.createList = this.createList.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.deleteListItem = this.deleteListItem.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.toggleDone = this.toggleDone.bind(this);
  }

  componentWillMount() {
    if (!window.localStorage) return;

    if (!localStorage.getItem('listId')) localStorage.setItem('listId', '0');

    if (!localStorage.getItem('lists'))
      localStorage.setItem('lists', JSON.stringify([]));

    this.setState({
      lists: JSON.parse(localStorage.getItem('lists')),
      id: parseInt(localStorage.getItem('listId'), 10),
    });
  }

  createList(title) {
    const { lists, id } = this.state;
    const date = new Date();

    const newList = {
      id,
      title,
      items: [],
      createdAt: date,
      updatedAt: date,
    };

    lists.push(newList);

    this.setState(prev => ({ lists, id: prev.id + 1, showDialog: false }));

    localStorage.setItem('listId', JSON.stringify(id + 1));
    localStorage.setItem('lists', JSON.stringify(lists));
  }

  deleteList(id) {
    return _ => {
      const { lists } = this.state;

      const newLists = lists.filter(list => list.id !== id);

      this.setState({ lists: newLists });

      localStorage.setItem('lists', JSON.stringify(newLists));
    };
  }

  addListItem(id) {
    return item => {
      const lists = this.state.lists.map(list => {
        if (list.id === id) list.items.push(item);
        return list;
      });

      this.setState({ lists });

      localStorage.setItem('lists', JSON.stringify(lists));
    };
  }

  deleteListItem(listId) {
    // Grab the index of the targeted list
    let index;

    // Grab the targeted list and assign the index
    const list = this.state.lists.filter((list, i) => {
      if (list.id === listId) index = i;
      return list.id === listId;
    })[0];

    return itemId => {
      // Grab the current list of lists
      const { lists } = this.state;

      // Filter the unwanted item
      const newItems = list.items.filter(item => item.id !== itemId);

      // Assign the filtered list of item to the targeted list with the index
      lists[index].items = newItems;

      // Set it back to the state
      this.setState(prev => ({
        lists,
      }));

      localStorage.setItem('lists', JSON.stringify(lists));
    };
  }

  toggleDone(listId) {
    let index;

    const list = this.state.lists.filter((list, i) => {
      if (list.id === listId) index = i;
      return list.id === listId;
    })[0];

    return ({ itemId, value }) => {
      const { lists } = this.state;

      const newItems = list.items.map(item => {
        let newItem = item;

        if (item.id === itemId) newItem.done = value;

        return newItem;
      });

      lists[index].items = newItems;

      this.setState(prev => ({
        lists,
      }));

      console.log(lists);

      localStorage.setItem('lists', JSON.stringify(lists));
    };
  }

  showDialog(type) {
    return _ => {
      this.setState(prev => ({
        dialogType: type,
        showDialog: !prev.showDialog,
      }));
    };
  }

  render() {
    const { lastModified, lists, dialogType, showDialog: open } = this.state;
    const {
      createList,
      deleteList,
      addListItem,
      deleteListItem,
      showDialog,
      pickYourTrick,
      toggleDone,
    } = this;

    const action = dialogType === 'list' ? createList : addListItem;

    return (
      <div>
        <Header lastModified={lastModified} showDialog={showDialog('list')} />
        {lists.map(list => (
          <List
            key={list.id}
            list={list}
            deleteList={deleteList(list.id)}
            addListItem={addListItem(list.id)}
            deleteListItem={deleteListItem(list.id)}
            toggleDone={toggleDone(list.id)}
          />
        ))}
        {open && (
          <Dialog
            type={dialogType}
            closeDialog={() => this.setState({ showDialog: false })}
            action={action}
          />
        )}
      </div>
    );
  }
}
