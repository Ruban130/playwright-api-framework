import Ajv, { JSONSchemaType } from 'ajv';
import logger from './logger.js';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class SchemaValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      strict: true,
      validateSchema: true,
      useDefaults: true,
    });
  }

  /**
   * Validate data against JSON Schema
   */
  public validate<T>(schema: JSONSchemaType<T>, data: unknown): ValidationResult {
    try {
      const validate = this.ajv.compile(schema);
      const isValid = validate(data);

      if (!isValid) {
        const errors = validate.errors?.map((error) => `${error.instancePath} ${error.message}`) || [];
        logger.warn('Schema validation failed', { errors });
        return {
          isValid: false,
          errors,
        };
      }

      logger.debug('Schema validation passed');
      return {
        isValid: true,
        errors: [],
      };
    } catch (error) {
      logger.error('Schema validation error', error);
      return {
        isValid: false,
        errors: ['Schema validation error occurred'],
      };
    }
  }

  /**
   * User schema for validation
   */
  public userSchema: JSONSchemaType<Record<string, unknown>> = {
    type: 'object',
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      username: { type: 'string' },
    },
    required: ['id', 'name', 'email'],
  };

  /**
   * Post schema for validation
   */
  public postSchema: JSONSchemaType<Record<string, unknown>> = {
    type: 'object',
    properties: {
      userId: { type: 'number' },
      id: { type: 'number' },
      title: { type: 'string' },
      body: { type: 'string' },
    },
    required: ['userId', 'id', 'title', 'body'],
  };

  /**
   * Comment schema for validation
   */
  public commentSchema: JSONSchemaType<Record<string, unknown>> = {
    type: 'object',
    properties: {
      postId: { type: 'number' },
      id: { type: 'number' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      body: { type: 'string' },
    },
    required: ['postId', 'id', 'name', 'email', 'body'],
  };
}

export const schemaValidator = new SchemaValidator();
