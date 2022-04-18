import { Router } from 'express';
import bodyParser from 'body-parser';

export const test = Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

test.get('/', urlencodedParser, async (req, res) => {
  console.log(req.session);

  fetch('http://127.0.0.1:8000/api/recs',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // targets: [ req.session.class ],
        targets: [ 'CSCE 431' ],
        tags: [ 'Artificial Intelligence', 'Database', 'Recommender Sytems' ],
        // tags: req.session.tags,
        pos: ['CSCE 445'],
        negs: ['CSCE 443'],
        // done: req.session.prevClasses,
        done: ['CSCE 121', 'CSCE 222', 'CSCE 313']
      })
    }
  )
    .then((res) => res.json())
    .then((resp) => {
      console.log(resp);
      res.send({
        resp
      });
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
});
