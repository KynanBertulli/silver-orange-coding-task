/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import more_icon from './img/more-icon.svg';

export default function App() {
  const [toggles, setToggles] = useState([]);
  const [data, setData] = useState<any[]>([]);
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    const dataCopy = data.map((obj) => ({ ...obj, isToggled: false }));
    setRepos(dataCopy);
  }, [data]);

  const fetchGitHub = () => {
    console.log('hello!');
    const url = 'http://localhost:4000/repos';
    fetch(url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((json) => {
        json.sort(function (a: any, b: any) {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        setData(json);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const sortLan = (language: string) => {
    console.log('sort language: ' + language);
    const newRepos = data.filter((item) => item.language === language);
    setRepos(newRepos);
    console.log(newRepos);
  };
  const toggleRepo = (id: string) => {
    let val;
    const newRepos = repos.map((item) => {
      const temp = Object.assign({}, item);
      if (item.id === id) {
        val = item.isToggled;
        item.isToggled = !val;
        console.log(`https://api.github.com/repos/${item.full_name}/commits`);
        fetch(`https://api.github.com/repos/${item.full_name}/commits`)
          .then((response) => response.json())
          .then((commit) => {
            const latestCommit = commit[0];
            console.log(latestCommit.commit.message);
            item.commit_message = latestCommit.commit.message;
            item.commit_author = latestCommit.commit.author.name;
            item.commit_date = latestCommit.commit.author.date;
          })
          .catch((error) => console.error(error));
        // test url:
        // https://raw.githubusercontent.com/KynanBertulli/silver-orange-coding-task/main/README.md
        console.log(
          `https://raw.githubusercontent.com/${item.full_name}/master/README.md`
        );
        fetch(
          `https://raw.githubusercontent.com/${item.full_name}/master/README.md`
        )
          .then((response) => {
            if (response.status === 200) {
              return response.text();
            }
            return 'No ReadMe.md file found';
          })
          .then((readme) => {
            item.read_me = readme;
          });
      }
      return item;
    });
    setRepos(newRepos);
  };
  const openMarkDown = (id: string) => {
    window.location.href = `http://localhost:3000/repo/${id}`;
  };
  return (
    <div className="App">
      <div>
        <h2>hello</h2>
        <button className="fetch-btn" onClick={fetchGitHub}>
          fetch github repos
        </button>
      </div>
      {repos.map((repo) => {
        return (
          <div key={repo.id} className="repo-container">
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
                <div
                  className="repo-lan"
                  onClick={() => {
                    sortLan(repo.language);
                  }}
                >
                  {repo.language}
                </div>
                <div className="repo-forks">fork count:{repo.forks}</div>
              </div>
            </div>
            <div
              style={{ height: 20 }}
              className={repo.isToggled ? 'more-info expanded' : 'more-info'}
            >
              <img
                src={more_icon}
                style={{
                  transform: `rotate(${repo.isToggled ? '0deg' : '180deg'})`,
                  height: 10,
                }}
                onClick={() => {
                  toggleRepo(repo.id);
                }}
              />
              <p>{repo.commit_author}</p>
              <p>{repo.commit_message}</p>
              <p>{repo.commit_date}</p>
              {/* <p>{repo.read_me}</p> */}
              <Link
                to={`/repo/${repo.id}`}
                state={{
                  data: JSON.stringify(
                    repos.filter((item) => item.id === repo.id)
                  ),
                }}
              >
                <button className="fetch-btn">open markdown</button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
