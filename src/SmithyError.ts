import { SmithyShape } from './SmithyShape.js'
import { SmithyAst } from './SmithyAst.js'
import { ErrorShape } from './types.js'

export class SmithyError extends SmithyShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: ErrorShape,
  ) {
    super(ast, shapeId, shape)
  }
}
