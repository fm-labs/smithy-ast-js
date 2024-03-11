import { SmithyShape } from './SmithyShape.js'
import { SmithyAst } from './SmithyAst.js'
import { ResourceShape } from './types.js'

export class SmithyResource extends SmithyShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: ResourceShape,
  ) {
    super(ast, shapeId, shape)
  }
}
