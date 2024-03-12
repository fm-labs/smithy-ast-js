import { AbstractModelShape, MemberShape } from './types.js'
import { SmithyTraitsAwareInterface } from './SmithyTrait.js'
import { SmithyAstNode } from './SmithyAstNode.js'
import { SmithyShapeWithMembers } from './SmithyShapeWithMembers.js'

export class SmithyMember extends SmithyAstNode implements SmithyTraitsAwareInterface {
  constructor(
    protected readonly parentNode: SmithyShapeWithMembers,
    public readonly name: string,
    protected readonly shape: MemberShape,
  ) {
    const _memberId = `${parentNode.getNamespace()}#${parentNode.getName()}$${name}`
    super(parentNode.getAst(), _memberId, shape)
  }

  public getTarget(): string {
    return this.shape.target
  }

  public getTargetShape(): AbstractModelShape | null | undefined {
    return this.ast.getShape(this.shape.target)
  }

  public getTargetNode(): any {
    // @todo: fix return type
    const shape = this.ast.getShape(this.shape.target)
    //return new SmithyStructure(this.ast, this.shape.target, shape)
    //return SmithyAst.nodeFromModelShape(this.ast, this.shape.target, shape!)
    return this.ast.buildNodeFromModelShape(this.shape.target, shape!)
  }
}
