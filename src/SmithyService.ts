import { OperationShape, ServiceShape } from './types.js'
import { SmithyAst } from './SmithyAst.js'
import { SmithyOperation } from './SmithyOperation.js'
import { SmithyShape } from './SmithyShape.js'

export class SmithyService extends SmithyShape {
  public readonly version: string

  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly service: ServiceShape,
  ) {
    super(ast, shapeId, service)
    this.version = service.version
  }

  public getNamespace(): string {
    return this.namespace
  }

  /**
   * Get the service id
   * @deprecated Use getName() instead
   */
  public getServiceId(): string {
    return this.name
  }

  public listOperations(): string[] {
    return this.ast.listServiceOperations(this.shapeId)
  }

  public listResources(): string[] {
    //return this.ast.listServiceResources(this.shapeId)
    return [] // @todo
  }

  public getOperation(operationId: string): SmithyOperation | null {
    const operationShape = this.ast.getShape(operationId) as OperationShape
    if (!operationShape) {
      return null
    }
    return new SmithyOperation(this.ast, operationId, operationShape)
  }
}
