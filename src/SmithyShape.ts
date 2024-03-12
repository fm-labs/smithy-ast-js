import { SmithyAst } from './SmithyAst.js'
import { AbstractModelShape } from './types.js'
import { SmithyTraitsAwareInterface } from './SmithyTrait.js'
import { SmithyAstNode } from './SmithyAstNode.js'

export abstract class SmithyShape extends SmithyAstNode implements SmithyTraitsAwareInterface {
  public readonly shapeType: string

  protected constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: AbstractModelShape,
  ) {
    super(ast, shapeId, shape)
    this.shapeType = shape.type
  }

  /**
   * Returns the shape type.
   */
  public getShapeType(): string {
    return this.shapeType
  }

  /**
   * Returns the JSON AST representation.
   */
  public getShape(): AbstractModelShape {
    return this.shape
  }
}
