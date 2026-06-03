// rs-react-app\src\App.tsx
import { Component } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorButton from './components/ErrorButton';
import Card from './components/Card';
import { type State } from './types';

// 🛡️ Интеграция новых функциональных компонентов Модуля 6
import { Modal } from './components/Modal';
import { UncontrolledForm } from './components/UncontrolledForm';
import { ControlledForm } from './components/ControlledForm';
import { SubmissionsGrid } from './components/SubmissionsGrid';

interface ExtendedState extends State {
  activeFormModal: 'none' | 'uncontrolled' | 'controlled';
}

class App extends Component<Record<string, never>, ExtendedState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      results: [],
      isLoading: false,
      searchTerm: localStorage.getItem('search_term') || '',
      hasError: false,
      activeFormModal: 'none',
    };
  }

  componentDidMount() {
    this.fetchData(this.state.searchTerm);
  }

  fetchData = async (term: string) => {
    const trimmedTerm = term.trim();
    this.setState({ isLoading: true, searchTerm: trimmedTerm });

    localStorage.setItem('search_term', trimmedTerm);

    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(trimmedTerm)}`
      );

      const data = await response.json();

      if (response.ok && data.results) {
        this.setState({
          results: data.results,
          isLoading: false,
          hasError: false,
        });
      } else {
        this.setState({ results: [], isLoading: false });
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      this.setState({ results: [], isLoading: false });
    }
  };

  handleCloseFormModal = () => {
    this.setState({ activeFormModal: 'none' });
  };

  render() {
    const { results, isLoading, activeFormModal } = this.state;

    return (
      <ErrorBoundary>
        <section id="center">
          <h1>Rick and Morty Search</h1>

          <SearchBar onSearch={this.fetchData} />

          <div
            className="controls-layout-row"
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              margin: '16px 0',
            }}
          >
            <ErrorButton />

            {/* 🛡️ Кнопки вызова модальных окон анкет (Требование ТЗ — запуск без ухода с главной страницы) */}
            <button
              type="button"
              className="refresh-button"
              onClick={() => this.setState({ activeFormModal: 'uncontrolled' })}
              style={{
                background: '#2b6cb0',
                color: '#fff',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              📋 Uncontrolled Форма
            </button>
            <button
              type="button"
              className="refresh-button"
              onClick={() => this.setState({ activeFormModal: 'controlled' })}
              style={{
                background: '#2c5282',
                color: '#fff',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ⚡ Controlled Форма (RHF)
            </button>
          </div>

          <div className="results-area">
            {isLoading ? (
              <div className="loader">Ищем персонажей в мультивселенной...</div>
            ) : (
              <div className="card-grid">
                {results.length > 0 ? (
                  results.map((char) => <Card key={char.id} character={char} />)
                ) : (
                  <p className="no-results">
                    По вашему запросу никого не нашли. Попробуйте другой поиск!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 🛡️ Выводим накопительную историю анкет из Zustand строго под сеткой персонажей */}
          <section
            className="submissions-section"
            style={{
              marginTop: '48px',
              borderTop: '2px solid #e2e8f0',
              paddingTop: '24px',
              width: '100%',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                marginBottom: '16px',
                fontWeight: '700',
              }}
            >
              История заполненных анкет пользователей (Module 6)
            </h2>
            <SubmissionsGrid />
          </section>
        </section>

        <div className="ticks"></div>
        <section id="spacer"></section>

        {/* 🛡️ ИНТЕГРАЦИЯ ПОРТАЛОВ: Рендерится на уровне document.body, управляется из стейта класса App */}
        <Modal
          isOpen={activeFormModal === 'uncontrolled'}
          onClose={this.handleCloseFormModal}
          title="Анкета: Неконтролируемый подход (FormData)"
        >
          <UncontrolledForm onSuccess={this.handleCloseFormModal} />
        </Modal>

        <Modal
          isOpen={activeFormModal === 'controlled'}
          onClose={this.handleCloseFormModal}
          title="Анкета: Управляемый подход (React Hook Form & Zod v4)"
        >
          <ControlledForm onSuccess={this.handleCloseFormModal} />
        </Modal>
      </ErrorBoundary>
    );
  }
}

export default App;
