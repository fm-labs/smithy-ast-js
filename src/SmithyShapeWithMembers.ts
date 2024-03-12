import { SmithyMember } from './SmithyMember.js'
import { StructureShape, UnionShape } from './types.js'
import { SmithyAst } from './SmithyAst.js'
import { SmithyAggregateShape } from './SmithyAggregateShape.js'

export class SmithyShapeWithMembers extends SmithyAggregateShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: StructureShape | UnionShape,
  ) {
    super(ast, shapeId, shape)
  }

  /**
   * List the member IDs of the structure
   * @returns {string[]}
   */
  public listMembers(): string[] {
    return Object.keys(this.shape.members)
  }

  /**
   * Get a map of member keys and target shape types
   * @returns {Record<string, string>}
   */
  public getMemberTypes(): Record<string, string> {
    const memberTypes: Record<string, string> = {}
    Object.entries(this.shape.members).forEach(
      ([key, member]) => (memberTypes[key] = member.target),
    )
    return memberTypes
  }

  /**
   * Get the member instances of the structure
   * @returns {SmithyMember[]}
   */
  public getMembers(): SmithyMember[] {
    return Object.entries(this.shape.members).map(([memberName, memberShape]) => {
      return new SmithyMember(this, memberName, memberShape)
    })
  }

  /**
   * Get a member instance by member name
   * @param memberName
   * @returns {SmithyMember | undefined}
   */
  public getMember(memberName: string): SmithyMember | undefined {
    const member = this.shape.members[memberName]
    if (!member) {
      return undefined
    }
    return new SmithyMember(this, memberName, member)
  }
}
