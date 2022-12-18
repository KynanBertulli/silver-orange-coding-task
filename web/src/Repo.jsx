/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import './App.css';

export default function Repo() {
  const [repo, setRepoData] = useState({});

  const location = useLocation();
  const params = useParams();
  console.log('id: ' + params.id);

  const returnToMain = () => {
    window.location.href = 'http://localhost:3000/';
  };
  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo.full_name}/commits`)
      .then((response) => response.json())
      .then((commit) => {
        const latestCommit = commit[0];
        console.log(latestCommit.commit.message);

        repo.commit_message = latestCommit.commit.message;
        repo.commit_author = latestCommit.commit.author.name;
        repo.commit_date = latestCommit.commit.author.date;
        setRepoData(repo);
      })
      .catch((error) => console.error(error));
    fetch(
      `https://raw.githubusercontent.com/${repo.full_name}/master/README.md`
    )
      .then((response) => {
        if (response.status === 200) {
          return response.text();
        }
        return 'No ReadMe.md file found';
      })
      .then((readme) => {
        repo.read_me = readme;
        setRepoData(repo);
      });
  }, [repo]);
  useEffect(() => {
    const data = location.state.data;
    const obj = JSON.parse(data);
    setRepoData(obj[0]);
    console.log(obj[0]);
  }, [location.state.data]);

  return (
    <div className="App">
      <div>
        <h2>one repo item page</h2>
        <button className="fetch-btn" onClick={returnToMain}>
          return to main screen
        </button>
      </div>
      {/* {JSON.stringify(repoData)} */}
      <div className="repo-container" style={{ minHeight: '500px' }}>
        <div className="title">
          <h3>{repo.name}</h3>
        </div>
        <div className="repo-desc">
          <div>
            <p>{repo.description}</p>
            <p
              style={{
                textAlign: 'left',
                margin: '0 15px',
                fontSize: '11px',
              }}
            >
              {repo.created_at}
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="repo-lan">{repo.language}</div>
            <div className="repo-forks">fork count:{repo.forks}</div>
          </div>
        </div>
        <div
          style={{ height: 20 }}
          className={repo.isToggled ? 'more-info expanded' : 'more-info'}
        >
          <p>{repo.commit_author}</p>
          <p>{repo.commit_message}</p>
          <p>{repo.commit_date}</p>
        </div>
      </div>
    </div>
  );
}
