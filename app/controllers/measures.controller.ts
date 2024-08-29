import express from 'express'

exports.checkMeasurementAndCallGemini = (req: any, res: any) => {
  //call model to get measument of measure_type and customer_code
  const measumentOnMonth = true;
  if (measumentOnMonth) {
    const doubleReportError = {
      error_code:"INVALID_DATA",
      error_description: "Leitura do mês ja realizada"
    }
    res.status(409).json(doubleReportError);
  }

  //call gemini lib
}

exports.confirmAndCorrectMeasurement = (req: any, res: any) => {
  //call model to get by the measure_uuid
  const measumentByuuid = {
    image: '',
    customer_code:'',
    measure_datetime: '',
    measure_type:'',
    measure_uuid: '',
    measure_confirmed: false,
    value:''
  }
  
  if (!measumentByuuid) {
    const measumentNotFoundError = {
      error_code: "MEASURE_NOT_FOUND",
      error_description: "Leitura não encontrada"
    }
    res.status(404).json(measumentNotFoundError);
  }

  if (measumentByuuid.measure_confirmed) {
    const measumentConfirmedError = {
      error_code: "CONFIRMATION_DUPLICATE",
      error_description: "Leitura do mês já realizada"
    }
    res.status(409).json(measumentConfirmedError);
  }

  measumentByuuid.value = req.body.confirmed_value;
  try {
    //model save
    res.status(200).json({ success: true })
  } catch (err) {
    console.log(err)
    res.end()
  }
}

exports.listMeasurements = (req: any, res: any) => {
  const measureType = req.query.measure_type.toLowerCase();
  const customerCode = req.params.customerCode

  if (measureType !== 'GAS' || measureType !== 'WATER'){
    const measureTypeError = {
      error_code: "INVALID_TYPE",
      error_description: "Tipo de permissão não permitida"
    }
    res.status(400).json()
  }

  let query: any = {
    customer_code: customerCode
  }

  if (measureType)
    query = {...query, measure_type: measureType};

  try {
    //model find measures
    res.status(200).json('found registers')
  }
  catch (err) {
    console.log(err)
    res.end()
  }
}

exports.validateInput = (req: any, res: any, next: any) => {

}