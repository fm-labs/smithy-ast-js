import { SmithyAst } from './SmithyAst.js'
import { AbstractModelShape } from './types.js'
import { SmithyShape } from './SmithyShape.js'

export class SmithyAggregateShape extends SmithyShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: AbstractModelShape,
  ) {
    super(ast, shapeId, shape)
  }
}
