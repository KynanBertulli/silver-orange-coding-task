import { Router, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import CircularJSON from 'circular-json';
export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');
  // eslint-disable-next-line prefer-const
  let data: string = '';
  await new Promise<void>((resolve, reject) => {
    const url = 'https://api.github.com/users/silverorange/repos';
    axios
      .get(url)
      .then((response) => {
        res.status(200);
        data = CircularJSON.stringify(response);
        resolve();
      })
      .catch((error) => {
        res.status(404);
        reject();
      });
  });
  res.status(200);
  // console.log(JSON.parse(data));
  res.send(data);


  // TODO: See README.md Task (A). Return repo data here. You’ve got this!
});
