//rs-react-app\src\components\ErrorButton.tsx
import { Component } from 'react';

interface ErrorButtonState {
  shouldCrash: boolean;
}

class ErrorButton extends Component<Record<string, never>, ErrorButtonState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = { shouldCrash: false };
  }

  handleCrash = () => {
    this.setState({ shouldCrash: true });
  };

  render() {
    if (this.state.shouldCrash) {
      throw new Error('Критическая ошибка приложения!');
    }

    return (
      <button
        type="button"
        className="counter"
        onClick={this.handleCrash}
        style={{
          marginTop: '10px',
          backgroundColor: '#ff4d4d',
          color: 'white',
        }}
      >
        Вызвать ошибку
      </button>
    );
  }
}

export default ErrorButton;
