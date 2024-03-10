import { SmithyAst } from './SmithyAst.js'
import { ListShape, MapShape, ModelShape, UnionShape } from './types.js'
import { SmithyShape } from './SmithyShape.js'

export class SmithyAggregateShape extends SmithyShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: ModelShape,
  ) {
    super(ast, shapeId, shape)
  }

  //   public toSmithy(): string {
  //     // list
  //     if (this.shapeType === 'list') {
  //       const _shape = this.shape as ListShape
  //       const member = _shape.member.target.split('#')[1]
  //       return `
  // ${this.shapeType} ${this.name} {
  //   member: ${member}
  // }`
  //     }
  //
  //     // map
  //     if (this.shapeType === 'map') {
  //       const _shape = this.shape as MapShape
  //       const key = _shape.key.target.split('#')[1]
  //       const value = _shape.value.target.split('#')[1]
  //       return `
  // ${this.shapeType} ${this.name} {
  //   key: ${key}
  //   value: ${value}
  // }`
  //     }
  //
  //     // union
  //     if (this.shapeType === 'union') {
  //       const _shape = this.shape as UnionShape
  //       const membersStr = Object.entries(_shape.members).map(([key, value]) => {
  //         const member = value.target.split('#')[1]
  //         return `  ${key}: ${member}`
  //       })
  //       return `
  // ${this.shapeType} ${this.name} {
  // ${membersStr.join('\n')}
  // }`
  //     }
  //
  //     return `
  // //@todo UNSUPPORTED TYPE ${this.shapeType} ${this.name} {}`
  //   }
}
