import { ErrorShape, OperationShape, ResourceShape, ServiceShape } from './types.js'
import { SmithyAst } from './SmithyAst.js'
import { SmithyOperation } from './SmithyOperation.js'
import { SmithyShape } from './SmithyShape.js'
import { SmithyResource } from './SmithyResource.js'
import { SmithyError } from './SmithyError.js'

export class SmithyService extends SmithyShape {
  public readonly version: string

  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: ServiceShape,
  ) {
    super(ast, shapeId, shape)
    this.version = shape.version
  }

  /**
   * Get the service id
   * @deprecated Use getName() instead
   */
  public getServiceId(): string {
    return this.name
  }

  /**
   * Get a list of operation IDs
   * @returns {string[]}
   */
  public listOperations(): string[] {
    return this.ast.listServiceOperations(this.shapeId)
  }

  /**
   * Get an operation instance by ID
   * @param operationId
   * @returns {SmithyResource | null}
   */
  public getOperation(operationId: string): SmithyOperation | null {
    const operationShape = this.ast.getShape(operationId) as OperationShape
    if (!operationShape) {
      return null
    }
    return new SmithyOperation(this.ast, operationId, operationShape)
  }

  /**
   * Get a list of resource IDs
   * @returns {string[]}
   */
  public listResources(): string[] {
    return this.ast.listServiceResources(this.shapeId)
  }

  /**
   * Get a resource instance by ID
   * @param resourceId
   * @returns {SmithyResource | null}
   */
  public getResource(resourceId: string): SmithyResource | null {
    const resourceShape = this.ast.getShape(resourceId) as ResourceShape
    if (!resourceShape) {
      return null
    }
    return new SmithyResource(this.ast, resourceId, resourceShape)
  }

  /**
   * Get a list of error IDs
   * @returns {string[]}
   */
  public listErrors(): string[] {
    return this.ast.listServiceErrors(this.shapeId)
  }

  /**
   * Get an error instance by ID
   * @param errorId
   * @returns {SmithyError | null}
   */
  public getError(errorId: string): SmithyError | null {
    const errorShape = this.ast.getShape(errorId) as ErrorShape
    if (!errorShape) {
      return null
    }
    return new SmithyError(this.ast, errorId, errorShape)
  }
}
