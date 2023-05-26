import express, { Request, Response } from 'express';

const router = express.Router();

router.route('/')
  .get((req: Request, res: Response) => {
    res.status(404).json('This page does not exist');
  })
  .post((req: Request, res: Response) => {
    res.status(404).json('This page does not exist');
  })
  .put((req: Request, res: Response) => {
    res.status(404).json('This page does not exist');
  })
  .delete((req: Request, res: Response) => {
    res.status(404).json('This page does not exist');
  });

export default router;
