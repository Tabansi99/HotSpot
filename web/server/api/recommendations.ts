import { Router } from 'express';

export const recommendations = Router();

recommendations.get('/',async (req, res) => {
  console.log(req.session);
  if (req.session.class) {
    fetch('http://127.0.0.1:8000/api/recs',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targets: [ req.session.class ],
          tags: req.session.tags,
          pos: req.session.pos,
          neg: req.session.neg,
          done: req.session.prevClasses
        })
      }
    )
      .then((res) => res.json())
      .then((resp) => {
        res.send(resp.all);
        console.log(resp);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
    
    return;
  }

  res.send({
    Error: 'No class recommendation session active.'
  });
});

recommendations.get('/modal/:course',async (req, res) => {
  const { course } = req.params;

  if (req.session.class) {
    fetch('http://127.0.0.1:8000/api/recs',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targets: [ course ],
          tags: req.session.tags,
          pos: [],
          neg: [],
          done: req.session.prevClasses
        })
      }
    )
      .then((res) => res.json())
      .then((resp) => {
        res.send(resp.all);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
    
    return;
  }

  res.send({
    Error: 'No class recommendation session active.'
  });
});

recommendations.get('/pos/:course',async (req, res) => {
  const { course } = req.params;

  if (req.session.pos) {
    req.session.pos.push(course);

    fetch('http://127.0.0.1:8000/api/recs',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targets: [ req.session.class ],
          tags: req.session.tags,
          pos: req.session.pos,
          neg: req.session.neg,
          done: req.session.prevClasses
        })
      }
    )
      .then((res) => res.json())
      .then((resp) => {
        res.send(resp.all);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
    
    return;
  }

  res.send({
    Error: 'No class recommendation session active.'
  });
});

recommendations.get('/neg/:course',async (req, res) => {
  const { course } = req.params;

  console.log(req.session);

  if (req.session.neg) {
    req.session.neg.push(course);

    fetch('http://127.0.0.1:8000/api/recs',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targets: [ req.session.class ],
          tags: req.session.tags,
          pos: req.session.pos,
          neg: req.session.neg,
          done: req.session.prevClasses
        })
      }
    )
      .then((res) => res.json())
      .then((resp) => {
        res.send(resp.all);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
    
    return;
  }

  res.send({
    Error: 'No class recommendation session active.'
  });
});

recommendations.get('/done/:course',async (req, res) => {
  const { course } = req.params;

  if (req.session.prevClasses) {
    req.session.prevClasses.push(course);

    fetch('http://127.0.0.1:8000/api/recs',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targets: [ req.session.class ],
          tags: req.session.tags,
          pos: req.session.pos,
          neg: req.session.neg,
          done: req.session.prevClasses
        })
      }
    )
      .then((res) => res.json())
      .then((resp) => {
        res.send(resp.all);
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
    
    return;
  }

  res.send({
    Error: 'No class recommendation session active.'
  });
});