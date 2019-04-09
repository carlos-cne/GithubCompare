import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Container, Repository, Actions } from './styles';

const btnClass = (id, repositoryLoading) => classNames({
  // Adicionei esta função para mostrar o loading
  'fa fa-refresh fa-2x': true,
  'fa-pulse': id === repositoryLoading,
});

const CompareList = ({
  repositories, repositoryLoading, refreshRepository, removeRepository,
}) => (
  <Container>
    {repositories.map(repository => (
      <Repository key={repository.id}>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <strong>{repository.name}</strong>
          <small>{repository.owner.login}</small>
        </header>
        <ul>
          <li>
            {repository.stargazers_count}
            <small> starts</small>
          </li>
          <li>
            {repository.forks_count}
            <small> forks</small>
          </li>
          <li>
            {repository.open_issues_count}
            <small> issues</small>
          </li>
          <li>
            {repository.last_commit}
            <small> last commit</small>
          </li>
        </ul>
        <Actions>
          <span>
            <i
              className={btnClass(repository.id, repositoryLoading)}
              onClick={() => refreshRepository(repository.id)}
            />
          </span>
          <span>
            <i className="fa fa-trash fa-2x" onClick={() => removeRepository(repository.id)} />
          </span>
        </Actions>
      </Repository>
    ))}
  </Container>
);

CompareList.defaultProps = {
  repositoryLoading: null,
};

CompareList.propTypes = {
  repositories: PropTypes.arrayOf(
    PropTypes.shape({
      owner: PropTypes.shape({
        login: PropTypes.string,
        avatar_url: PropTypes.string,
      }),
      name: PropTypes.string,
      stargazers_count: PropTypes.number,
      forks_count: PropTypes.number,
      open_issues_count: PropTypes.number,
      last_commit: PropTypes.string,
    }),
  ).isRequired,
  repositoryLoading: PropTypes.number,
  refreshRepository: PropTypes.func.isRequired,
  removeRepository: PropTypes.func.isRequired,
};

export default CompareList;
