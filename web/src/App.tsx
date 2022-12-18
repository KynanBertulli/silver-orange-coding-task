import React, { useState } from 'react';

import './App.css';

export function App() {
  const [repos, setRepos] = useState<any[]>([]);

  const fetchGitHub = () => {
    console.log('hello!');
    const url = 'http://localhost:4000/repos';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);

        json.sort(function (a: any, b: any) {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        setRepos(json);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="App">
      <div>
        <h2>hello</h2>
        <button className="fetch-btn" onClick={fetchGitHub}>
          fetch github repos
        </button>
        <div className="sort-btns">
          <button className="sort-btns">sort chrono</button>
        </div>
      </div>
      {repos.map((repo) => {
        return (
          <div key={repo.id} className="repo-container">
            <div className="title">
              <h3>{repo.name}</h3>
            </div>
            <div className="repo-desc">
              <p style={{ padding: '0 5%' }}>
                {repo.description}
                <br />
                {repo.created_at}
              </p>
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
          </div>
        );
      })}
    </div>
  );
}
