import { SmithyAst } from './SmithyAst.js'
import { UnionShape } from './types.js'
import { SmithyShapeWithMembers } from './SmithyShapeWithMembers.js'

export class SmithyUnion extends SmithyShapeWithMembers {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: UnionShape,
  ) {
    super(ast, shapeId, shape)
  }

  public getShape(): UnionShape {
    return this.shape
  }
}
