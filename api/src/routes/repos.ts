import { Router, Request, Response } from 'express';
import axios from 'axios';
import CircularJSON from 'circular-json';
import fs from 'fs';
import path from 'path';
export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');
  let data: string = '';
  await new Promise<void>((resolve, reject) => {
    try {
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
    } catch (e) {
      console.log('error: ' + e);
    }
  });
  res.status(200);

  let file_data = JSON.parse(
    fs
      .readFileSync(path.join(__dirname, '..', '..', 'data/repos.json'))
      .toString()
  );

  file_data = file_data.concat(JSON.parse(data).data);

  file_data = file_data.filter((item: any) => item.fork === false);
  res.send(file_data);

  // TODO: See README.md Task (A). Return repo data here. You’ve got this!
});
