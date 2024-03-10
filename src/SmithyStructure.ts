import { SmithyAst } from './SmithyAst.js'
import { ModelShape } from './types.js'
import { SmithyShape } from './SmithyShape.js'

export class SmithyStructure extends SmithyShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: ModelShape,
  ) {
    super(ast, shapeId, shape)
  }

  //   public toSmithy(): string {
  //     return `
  // structure ${this.name} {
  // }`
  //   }
}
