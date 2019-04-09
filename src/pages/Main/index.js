import React, { Component } from 'react';
import moment from 'moment';
import logo from '../../assets/logo.png';
import { Container, Form } from './styles';
import CompareList from '../../components/CompareList';

import api from '../../services/api';

export default class Main extends Component {
  state = {
    repositoryError: false,
    loading: false,
    repositoryInput: '',
    repositories: [],
    repositoryLoading: null,
  };

  async componentDidMount() {
    if (localStorage.getItem('@GithubCompare')) {
      const repositories = await JSON.parse(localStorage.getItem('@GithubCompare'));
      this.setState({ repositories });
    }
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSetLocalStorage = async () => {
    const { repositories } = this.state;
    await localStorage.setItem('@GithubCompare', JSON.stringify(repositories));
  };

  handleAddRepository = async (e) => {
    const { repositoryInput, repositories } = this.state;
    e.preventDefault();
    this.setState({ loading: true });
    try {
      const { data: repository } = await api.get(`/repos/${repositoryInput}`);
      repository.last_commit = moment(repository.pushed_at).fromNow();

      const idx = repositories.findIndex(repo => repo.id === repository.id);
      if (idx === -1) {
        await this.setState(prevState => ({
          repositoryInput: '',
          repositoryError: false,
          repositories: [...prevState.repositories, repository],
        }));
      } else {
        repositories[idx] = repository;
        await this.setState({
          repositoryInput: '',
          repositoryError: false,
          repositories,
        });
      }
      this.handleSetLocalStorage();
    } catch (error) {
      this.setState({ repositoryError: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  refreshRepository = async (repositoryID) => {
    this.setState({ repositoryLoading: repositoryID });
    const { repositories } = this.state;
    const idx = repositories.findIndex(repository => repository.id === repositoryID);
    try {
      const { data: repository } = await api.get(
        `/repos/${repositories[idx].owner.login}/${repositories[idx].name}`,
      );
      repository.last_commit = moment(repository.pushed_at).fromNow();
      repositories[idx] = repository;
      this.setState({
        repositories,
      });
      this.handleSetLocalStorage();
    } catch (error) {
      alert(`Ocorreu um erro ao atualizar o repositório. Detalhes:  ${error}`);
    } finally {
      // coloquei um setTimeout para mostrar que está atualizando
      setTimeout(() => this.setState({ repositoryLoading: null }), 1000);
    }
  };

  removeRepository = (id) => {
    const { repositories } = this.state;
    const repositoriesFilter = repositories.filter(repository => repository.id !== id);

    this.setState({ repositories: repositoriesFilter }, () => this.handleSetLocalStorage());
  };

  render() {
    const {
      repositoryInput,
      repositories,
      repositoryError,
      loading,
      repositoryLoading,
    } = this.state;
    return (
      <Container>
        <img src={logo} alt="Github Compare" />
        <Form withError={repositoryError} onSubmit={this.handleAddRepository}>
          <input
            type="text"
            placeholder="usuário/repositório"
            value={repositoryInput}
            name="repositoryInput"
            onChange={this.handleChange}
          />
          <button type="submit">{loading ? <i className="fa fa-spinner fa-pulse" /> : 'OK'}</button>
        </Form>
        <CompareList
          repositories={repositories}
          repositoryLoading={repositoryLoading}
          refreshRepository={id => this.refreshRepository(id)}
          removeRepository={id => this.removeRepository(id)}
        />
      </Container>
    );
  }
}
