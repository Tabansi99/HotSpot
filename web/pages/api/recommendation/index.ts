import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest , res: NextApiResponse) => {
  console.log('------------------------------------------------------------------------------------------------------------------------------------------------------')
  console.log(req.body);
  const body = JSON.parse(req.body);
  console.log(body.course);
  res.redirect('/course');
  return;
  try {

    res.status(200);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler;
