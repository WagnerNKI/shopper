import { Router } from 'express'

const router: Router = Router();

router
  .post('/upload', (req, res) => res.send('uploaded'))
  .patch('/confirm', (req, res) => res.send('confirmed'))
  .get('/:customerCode/list', (req, res) => res.send('list'))

export default router