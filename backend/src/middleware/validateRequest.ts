import { JSONSchemaType } from "ajv";
import ajv from "../utils/ajv";
import { NextFunction, Request, Response } from "express";

function validateRequest<T>(schema: JSONSchemaType<T>) {
  const validate = ajv.compile(schema)

  return (req: Request, res: Response, next: NextFunction) => {
    const valid = validate(req.body)

    if (!valid) {
      return res.status(400).json({
        message: 'Validation Error',
        errors: validate.errors?.map(err => {
          return {
            field: err.instancePath || err.params.missingProperty,
            message: err.message
          }
        })
      })
    }

    next()
  }
}

export default validateRequest