import {
  SmithyModel,
  OperationShape,
  ServiceShape,
  StructureShape,
  ShapeReference,
  ModelShape,
} from './types.js'
import { SmithyOperation } from './SmithyOperation.js'
import { SmithyService } from './SmithyService.js'

export class SmithyAst {
  private readonly model: SmithyModel

  constructor(model: SmithyModel) {
    this.model = model
  }

  /**
   * Get the raw model
   */
  public getModel() {
    return this.model
  }

  /**
   * List all services in the model
   */
  public listServices() {
    const services: string[] = []
    for (const shapeId in this.model.shapes) {
      const shape = this.model.shapes[shapeId]
      if (shape.type === 'service') {
        services.push(shapeId)
      }
    }
    return services
  }

  /**
   * List all operations for a service
   * @param serviceId
   */
  public listServiceOperations(serviceId: string) {
    const service = this.model.shapes[serviceId] as ServiceShape
    if (!service || service.type !== 'service') {
      console.warn('Service not found', serviceId)
      return []
    }
    const operations: string[] = []
    for (const operationId in service.operations) {
      const operationRef = service.operations[operationId]
      // const operation = this.model.shapes[operationRef.target] as OperationShape
      // if (!operation || operation.type !== 'operation') {
      //   continue
      // }
      operations.push(operationRef.target)
    }
    return operations
  }

  /**
   * Get a shape by ID
   * @param shapeId
   */
  public getShape(shapeId: string): ModelShape | undefined {
    if (!this.model.shapes[shapeId]) {
      return undefined
    }
    return this.model.shapes[shapeId]
  }

  /**
   * Get a shape by ref
   * @param ref
   */
  public getShapeByRef(ref: ShapeReference): ModelShape | undefined {
    if (!this.model.shapes[ref.target]) {
      return undefined
    }
    return this.model.shapes[ref.target]
  }

  /**
   * Get a service by ID
   * @param serviceId
   */
  public getServiceShape(serviceId: string): ServiceShape | undefined {
    const service = this.model.shapes[serviceId]
    if (!service || service.type !== 'service') {
      //throw new Error('Service not found')
      return undefined
    }
    return service as ServiceShape
  }

  /**
   * Get an operation by ID
   * @param operationId
   */
  public getOperationShape(operationId: string): OperationShape | undefined {
    const operation = this.model.shapes[operationId]
    if (!operation || operation.type !== 'operation') {
      //throw new Error('Operation not found')
      return undefined
    }
    return operation as OperationShape
  }

  /**
   * Get the input shape for an operation
   * @param operation
   * @deprecated Use SmithyOperation.getInput().getShape() instead
   */
  public getOperationInputShape(operation: OperationShape): StructureShape {
    //const inputRef = operation.input
    //return this.getShape(inputRef.target) as StructureShape
    return this.getShapeByRef(operation.input) as StructureShape
  }

  /**
   * Get the output shape for an operation
   * @param operation
   * @deprecated Use SmithyOperation.getOutput().getShape() instead
   */
  public getOperationOutputShape(operation: OperationShape): StructureShape {
    //const outputRef = operation.output
    //return this.getShape(outputRef.target) as StructureShape
    return this.getShapeByRef(operation.input) as StructureShape
  }

  /**
   * Get a service instance by ID
   * @param serviceId
   */
  public getService(serviceId: string): SmithyService | null {
    const serviceShape = this.getServiceShape(serviceId)
    if (!serviceShape) {
      return null
    }
    return new SmithyService(this, serviceId, serviceShape)
  }

  /**
   * Get an operation instance by ID
   * @param operationId
   */
  public getOperation(operationId: string): SmithyOperation | null {
    const operationShape = this.getShape(operationId) as OperationShape
    if (!operationShape) {
      return null
    }
    return new SmithyOperation(this, operationId, operationShape)
  }

  /**
   * Create a SmithyAst from a JSON string
   * @param json
   */
  public static fromJson(json: string): SmithyAst {
    return new SmithyAst(JSON.parse(json) as SmithyModel)
  }

  /**
   * Create a SmithyAst from a model
   * @param model
   */
  public static fromModel(model: SmithyModel): SmithyAst {
    return new SmithyAst(model)
  }
}
