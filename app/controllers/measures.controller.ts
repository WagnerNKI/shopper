import { Request, Response } from 'express';
import { Measure } from '../models/measure-model';
import getMeasurementValueFromImage from '../lib/gemini';

export class MeasureController {

  static checkMeasurementAndCallGemini = async (req: Request, res: Response) => {
    
    try {
      const measuresByCustomerAndType = Measure.findByCustomerCodeAndType(req.body.customer_code, req.body.measure_type)
      const measumentOnMonth = measuresByCustomerAndType.some((measure: Measure) => {
        const dateFromBody = new Date(req.body.measure_datetime);
        const measureDate = new Date(measure.measure_datetime)
        
        const measumentYear = measureDate.getFullYear();
        const newMeasumentYear = dateFromBody.getFullYear();
        const measumentMonth = measureDate.getMonth();
        const newMeasumentMonth = dateFromBody.getMonth();
        return measumentYear === newMeasumentYear 
          && measumentMonth === newMeasumentMonth
          && measure.measure_type === req.body.measure_type;
      });

      if (measumentOnMonth) {
        const doubleReportError = {
          error_code:"INVALID_DATA",
          error_description: "Leitura do mês ja realizada"
        }
        return res.status(409).json(doubleReportError);
      }
    
      const { measureValue, imageUrl } = await getMeasurementValueFromImage(req.body.image);

      const savedMeasure = Measure.saveMeasurement(
        new Measure(
          req.body.customer_code,
          req.body.measure_datetime,
          req.body.measure_type,
          false,
          imageUrl,
          measureValue,
        )
      )

      const response = {
        image_url: savedMeasure.image_url,
        measure_value: savedMeasure.measure_value,
        measure_uuid: savedMeasure.measure_uuid
      }
      return res.status(200).json(response);
    }
    catch (err) {
      console.log(err)
    }
  }
  
  static confirmAndCorrectMeasurement = (req: Request, res: Response) => {
    try {
      const measumentByuuid = Measure.findByUuid(req.body.measure_uuid);
      
      if (!measumentByuuid) {
        const measumentNotFoundError = {
          error_code: "MEASURE_NOT_FOUND",
          error_description: "Leitura não encontrada"
        }
        return res.status(404).json(measumentNotFoundError);
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

        Measure.saveMeasurement(measumentByuuid);
        
        return res.status(200).json({ success: true });
      }
    } catch (err) {
      console.log(err)
      res.end()
    }
  }
  
  static listMeasurements = (req: Request, res: Response) => {
    try {
      const measureType = Measure.getMeasureTypeFromQuery(req.query) 
      const customerCode = req.params.customerCode;
    
      if (measureType && measureType.toUpperCase() !== 'GAS' && measureType.toUpperCase() !== 'WATER'){
        const measureTypeError = {
          error_code: "INVALID_TYPE",
          error_description: "Tipo de permissão não permitida"
        }
        return res.status(400).json(measureTypeError)
      }
  
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
      return res.status(200).json(response);
    }
    catch (err) {
      console.log(err)
      res.end()
    }
  }
  
  static validateInput = (req: Request, res: Response, next: any) => {
    
    const validationError: Array<string> = [];

    Object.keys(req.body).forEach(key => {
      if (!Measure.isInputValid(key, req.body[key])) {
        validationError.push(key);
      }
    });

    if (validationError.length) {
      const error = {
        error_code: "INVALID_DATA",
        error_description: `Campo(s) ${validationError.join(', ')} inválido(s)`
      }
      res.status(400).json(error)
    }
    next()
  }
}