import { Router } from 'express'
import { MeasureController } from '../controllers/measures.controller';

const router: Router = Router();

router
  .get('/:customerCode/list', MeasureController.validateInput, MeasureController.listMeasurements)
  .post('/upload', MeasureController.validateInput, MeasureController.checkMeasurementAndCallGemini)
  .patch('/confirm', MeasureController.validateInput, MeasureController.confirmAndCorrectMeasurement)
  
export default router