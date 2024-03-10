import { SmithyAst } from './SmithyAst.js'
import { ModelShape } from './types.js'

export class SmithyShape {
  public readonly namespace: string
  public readonly name: string
  public readonly shapeType: string

  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: ModelShape,
  ) {
    this.namespace = shapeId.split('#')[0]
    this.name = shapeId.split('#')[1]
    this.shapeType = shape.type
  }

  public getNamespace(): string {
    return this.namespace
  }

  public getName(): string {
    return this.name
  }

  public getShapeType(): string {
    return this.shapeType
  }

  public getShape(): ModelShape {
    return this.shape
  }

  //   public toSmithy(): string {
  //     return `
  // ${this.shapeType} ${this.name}`
  //   }
}
