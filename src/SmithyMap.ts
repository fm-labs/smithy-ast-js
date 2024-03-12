import { SmithyAst } from './SmithyAst.js'
import { MapShape } from './types.js'
import { SmithyAggregateShape } from './SmithyAggregateShape.js'

export class SmithyMap extends SmithyAggregateShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: MapShape,
  ) {
    super(ast, shapeId, shape)
  }

  /**
   * Returns the type of the keys in the map.
   * @returns {string}
   */
  public getKeyType(): string {
    return this.shape.key.target
  }

  /**
   * Returns the type of the values in the map.
   * @returns {string}
   */
  public getValueType(): string {
    return this.shape.value.target
  }
}
