import session from 'express-session';
import { Router } from 'express';
import { test } from './test';
import { courses } from './courses';
import { recommendations } from './recommendations';

export const api = Router();

declare module 'express-session' {
  interface SessionData {
    class: string;
    major: string;
    tags: String[];
    prevClasses: String[];
    pos: String[];
    neg: String[];
  }
}

api.use(
  session({
    secret: 'some secret',
    cookie: { maxAge: 900000 },
    saveUninitialized: false,
    resave: true,
    rolling: true,
  }),
);

api.use('/test', test);
api.use('/courses', courses);
api.use('/recommendations', recommendations);