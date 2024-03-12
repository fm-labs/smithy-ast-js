import { SmithyAst } from './SmithyAst.js'
import { ListShape } from './types.js'
import { SmithyAggregateShape } from './SmithyAggregateShape.js'

export class SmithyList extends SmithyAggregateShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: ListShape,
  ) {
    super(ast, shapeId, shape)
  }

  public getMemberType(): string {
    return this.shape.member.target
  }
}
