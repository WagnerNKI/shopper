import database from '../database/measures-database';
import isValidBase64Image from '../lib/utils';

export class Measure {
  customer_code: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  measure_value: number;
  measure_uuid: string;

  constructor(
    customer_code: string,
    measure_datetime: Date,
    measure_type: string,
    has_confirmed: boolean,
    image_url: string,
    measure_value: number,
    measure_uuid: string
  ) {
    this.customer_code = customer_code;
    this.measure_datetime = measure_datetime;
    this.measure_type = measure_type;
    this.has_confirmed = has_confirmed;
    this.image_url = image_url;
    this.measure_value = measure_value;
    this.measure_uuid = measure_uuid;
  }

  static findByCustomerCodeAndType(customerCode: string, measureType?: string) {
    return database.filter((doc:Measure) => {
      if ((measureType && doc.measure_type === measureType) 
        && doc.customer_code === customerCode) {
          return doc
      } else if (!measureType && doc.customer_code === customerCode) {
        return doc
      }
    })
  }

  static findByUuid(measureUuid: string) {
    return database.find((doc:Measure) => doc.measure_uuid === measureUuid);
  }

  static getMeasureTypeFromQuery(queryParam: any) {
    if (!queryParam) 
      return null;

    if(Array.isArray(queryParam.measure_type)) 
      return queryParam.measure_type[0];

    return queryParam.measure_type as string;
  }

  static isInputValid(property: any, valueToValidate: any): boolean {
    const propertiesValidation = {
      customer_code: (valueToValidate: any): boolean => { return typeof valueToValidate === 'string' },
      measure_datetime: (valueToValidate: any): boolean => { return new Date(valueToValidate).toString() === 'Invalid Date' ? false : true },
      measure_type: (valueToValidate: any): boolean => { return typeof valueToValidate === 'string'},
      image: (valueToValidate: any): boolean => { return isValidBase64Image(valueToValidate)},
      confirmed_value: (valueToValidate: any): boolean => { return typeof valueToValidate === 'number' && !isNaN(valueToValidate)},
      measure_uuid: (valueToValidate: any): boolean => { return typeof valueToValidate === 'string'},
    };
    return propertiesValidation[property as keyof typeof propertiesValidation](valueToValidate)
  }
}