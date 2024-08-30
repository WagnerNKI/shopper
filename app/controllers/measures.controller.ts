import { Request, Response } from 'express';
import { Measure } from '../models/measure-model';

export class MeasureController {

  static checkMeasurementAndCallGemini = (req: Request, res: Response) => {
    const measuresByCustomerAndType = Measure.findByCustomerCodeAndType(req.body.customer_code, req.body.measure_type)
    const measumentOnMonth = measuresByCustomerAndType.some((measure: Measure) => {
      const measumentYear = new Date(measure.measure_datetime).getFullYear();
      const newMeasumentYear = new Date(req.body.measure_datetime).getFullYear();
      const measumentMonth = new Date(measure.measure_datetime).getMonth();
      const newMeasumentMonth = new Date(req.body.measure_datetime).getMonth();
      return measumentYear === newMeasumentYear && measumentMonth === newMeasumentMonth;
    });

    if (measumentOnMonth) {
      const doubleReportError = {
        error_code:"INVALID_DATA",
        error_description: "Leitura do mês ja realizada"
      }
      res.status(409).json(doubleReportError);
    }
  
    //call gemini lib
  }
  
  static confirmAndCorrectMeasurement = (req: Request, res: Response) => {
    const measumentByuuid = Measure.findByUuid(req.body.measure_uuid);
    
    if (!measumentByuuid) {
      const measumentNotFoundError = {
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura não encontrada"
      }
      res.status(404).json(measumentNotFoundError);
    } else {
      if (measumentByuuid.has_confirmed) {
        const measumentConfirmedError = {
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: "Leitura do mês já realizada"
        }
        res.status(409).json(measumentConfirmedError);
      }
    
      measumentByuuid.measure_value = req.body.confirmed_value;
      measumentByuuid.has_confirmed = true;

      try {
        //model save
        res.status(200).json({ success: true })
      } catch (err) {
        console.log(err)
        res.end()
      }
    }
  }
  
  static listMeasurements = (req: Request, res: Response) => {
    const measureType = Measure.getMeasureTypeFromQuery(req.query) 
    const customerCode = req.params.customerCode;
  
    if (measureType && measureType.toUpperCase() !== 'GAS' && measureType.toUpperCase() !== 'WATER'){
      const measureTypeError = {
        error_code: "INVALID_TYPE",
        error_description: "Tipo de permissão não permitida"
      }
      res.status(400).json(measureTypeError)
    }
  
    try {
      const measuresByCustomerAndType = Measure.findByCustomerCodeAndType(customerCode, measureType);
      const response = {
        customer_code: customerCode,
        measures: measuresByCustomerAndType.map(measure => {
          return {
            measure_uuid: measure.measure_uuid,
            measure_datetime: measure.measure_datetime,
            measure_type: measure.measure_type,
            has_confirmed: measure.has_confirmed,
            image_url: measure.image_url
          }
        })
      }
      res.status(200).json(response);
    }
    catch (err) {
      console.log(err)
      res.end()
    }
  }
  
  static validateInput = (req: Request, res: Response, next: any) => {
    next()
  }
}