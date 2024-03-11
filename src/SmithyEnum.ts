import { SmithyAst } from './SmithyAst.js'
import { EnumShape } from './types.js'
import { SmithyShape } from './SmithyShape.js'

export class SmithyEnum extends SmithyShape {
  constructor(
    protected readonly ast: SmithyAst,
    public readonly shapeId: string,
    protected readonly shape: EnumShape,
  ) {
    super(ast, shapeId, shape)
  }

  public getMembers(): Record<string, string | undefined> {
    const enumMembers = Object.entries(this.shape.members).map(([key, value]) => {
      let enumValue = null
      if (value?.traits && 'smithy.api#enumValue' in value.traits) {
        enumValue = value.traits['smithy.api#enumValue']
      }
      return {
        [key]: enumValue,
      }
    })
    return Object.assign({}, ...enumMembers)
  }
}
