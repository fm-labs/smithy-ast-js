import { SmithyAst } from './SmithyAst.js'
import { StructureShape } from './types.js'
import { SmithyShapeWithMembers } from './SmithyShapeWithMembers.js'

export class SmithyStructure extends SmithyShapeWithMembers {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: StructureShape,
  ) {
    super(ast, shapeId, shape)
  }

  public getShape(): StructureShape {
    return this.shape
  }
}
