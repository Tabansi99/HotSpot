import { NextApiRequest, NextApiResponse } from 'next';
import { sampleCourses } from '../../../utils/courses';

const handler = (req: NextApiRequest , res: NextApiResponse) => {
  console.log('------------------------------------------------------------------------------------------------------------------------------------------------------')
  console.log(req.body);
  // const body = JSON.parse(req.body);
  // console.log(body.course);
  res.send(sampleCourses);
  return;
}

export default handler;
