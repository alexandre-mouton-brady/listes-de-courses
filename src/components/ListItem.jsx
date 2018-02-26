import { Component } from 'inferno';
import anime from 'animejs';

export class ListItem extends Component {
  constructor(props) {
    super(props);

    this.toggleDone = this.toggleDone.bind(this);
    this.deleteListItem = this.deleteListItem.bind(this);
  }

  toggleDone() {
    const targets = `#checkmark-${this.props.meta.id}`;

    if (this.props.meta.done) {
      anime({
        targets,
        strokeDashoffset: [anime.setDashoffset, 0],
        direction: 'reverse',
        duration: 300,
        easing: 'easeInOutCubic',
        complete: () => {
          this.props.toggleDone({ itemId: this.props.meta.id, value: false });
        },
      });
    } else {
      this.props.toggleDone({ itemId: this.props.meta.id, value: true });

      anime({
        targets,
        strokeDashoffset: [0, anime.setDashoffset],
        direction: 'reverse',
        duration: 300,
        easing: 'easeInOutCubic',
      });
    }
  }

  deleteListItem() {
    this.props.deleteListItem(this.props.meta.id);
  }

  render() {
    const { toggleDone, deleteListItem } = this;
    const { meta } = this.props;

    return (
      <li
        className={meta.done ? 'list-item list-item--done' : 'list-item'}
        onClick={toggleDone}
      >
        <div className="list-item__done">
          {meta.done && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline id={`checkmark-${meta.id}`} points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <span className="list-item__title">{meta.title}</span>
        <button onClick={deleteListItem} className="list-item__delete">
          <svg
            width="20"
            height="20"
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
      </li>
    );
  }
}
