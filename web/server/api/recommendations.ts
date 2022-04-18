import { Router } from 'express';
import { sampleCourses } from '../../utils/courses';

export const recommendations = Router();

recommendations.get('/',async (_req, res) => {
  res.send(sampleCourses);
})