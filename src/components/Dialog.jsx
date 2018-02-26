import { Component } from 'inferno';
import anime from 'animejs';

export class Dialog extends Component {
  state = {
    title: '',
    text: '',
    empty: false,
  };

  constructor(props) {
    super(props);

    this.handleInput = this.handleInput.bind(this);
    this.action = this.action.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    this.input.focus();

    const title =
      this.props.type === 'list'
        ? 'Nouvelle liste de courses'
        : 'Nouvel article';

    this.setState({ title });

    anime
      .timeline()
      .add({
        targets: this.content,
        opacity: {
          value: [0, 1],
          duration: 800,
        },
        translateY: [-50, 0],
        duration: 500,
        easing: 'easeInOutQuad',
      })
      .add({
        targets: this.overlay,
        opacity: [0, 1],
        duration: 500,
        easing: 'easeInOutQuad',
        offset: '-=800',
      });
  }

  handleKeyPress({ key }) {
    if (key !== 'Enter') return;

    this.action();
  }

  handleInput({ target: { value } }) {
    this.setState({ text: value, empty: false });
  }

  action() {
    const { text } = this.state;

    if (text === '') {
      this.setState({ empty: true });
    } else {
      this.animOut().then(_ => {
        this.props.action(this.state.text);
      });
    }
  }

  closeDialog() {
    this.animOut().then(_ => {
      this.props.closeDialog();
    });
  }

  animOut() {
    const tl = anime
      .timeline()
      .add({
        targets: this.content,
        opacity: {
          value: [1, 0],
          duration: 800,
        },
        translateY: [0, -50],
        duration: 500,
        easing: 'easeInOutQuad',
      })
      .add({
        targets: this.overlay,
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInOutQuad',
        offset: '-=800',
      });

    return tl.finished;
  }

  render() {
    const { title, text, empty } = this.state;
    const { handleInput, handleKeyPress, action, closeDialog } = this;

    return (
      <div className="dialog">
        <div
          className="dialog__content"
          ref={el => {
            this.content = el;
          }}
        >
          <h1 className="dialog__title">{title}</h1>
          <input
            value={text}
            onInput={handleInput}
            onKeyPress={handleKeyPress}
            autocomplete="off"
            className={
              empty ? 'dialog__input dialog__input--error' : 'dialog__input'
            }
            type="text"
            placeholder={`Intitulé`}
            ref={el => {
              this.input = el;
            }}
          />
          {empty && (
            <p className="dialog__err-msg">
              /!\ - Mets au moins une lettre frère
            </p>
          )}

          <footer className="dialog__footer">
            <button class="dialog__btn" onClick={closeDialog}>
              Annulé
            </button>
            <button class="dialog__btn dialog__btn--success" onClick={action}>
              Créer
            </button>
          </footer>
        </div>

        <div
          className="dialog__overlay"
          onClick={closeDialog}
          ref={el => {
            this.overlay = el;
          }}
        />
      </div>
    );
  }
}
