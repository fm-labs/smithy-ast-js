import { AbstractModelShape, MemberShape, StructureShape } from './types.js'
import { SmithyTraitsAwareInterface } from './SmithyTrait.js'
import { SmithyStructure } from './SmithyStructure.js'
import { SmithyAstNode } from './SmithyAstNode.js'

export class SmithyMember extends SmithyAstNode implements SmithyTraitsAwareInterface {
  constructor(
    protected readonly struct: SmithyStructure,
    public readonly name: string,
    protected readonly shape: MemberShape,
  ) {
    const _memberId = `${struct.getNamespace()}#${struct.getName()}$${name}`
    super(struct.getAst(), _memberId, shape)
  }

  public getTarget(): string {
    return this.shape.target
  }

  public getTargetShape(): AbstractModelShape | null | undefined {
    return this.ast.getShape(this.shape.target)
  }

  public getTargetStructure(): SmithyStructure {
    const shape = this.ast.getShape(this.shape.target) as StructureShape
    return new SmithyStructure(this.ast, this.shape.target, shape)
  }

  // public getId(): string {
  //   return this.shapeId
  // }
  //
  // public getName(): string {
  //   return this.shapeId
  // }
  //
  // public listTraits(): string[] {
  //   if (!this.shape.traits) {
  //     return []
  //   }
  //   return Object.keys(this.shape.traits)
  // }
  //
  // public getTraits(): SmithyTrait[] {
  //   if (!this.shape.traits) {
  //     return []
  //   }
  //   return Object.entries(this.shape.traits).map(([traitName, traitValue]) => {
  //     return new SmithyTrait(this, traitName, traitValue)
  //   })
  // }
  //
  // public getTrait(traitName: string): SmithyTrait | undefined {
  //   if (!this.shape.traits) {
  //     return undefined
  //   }
  //   const trait = Object.entries(this.shape.traits).find(([key]) => key === traitName)
  //   if (!trait) {
  //     return undefined
  //   }
  //   return new SmithyTrait(this, trait[0], trait[1])
  // }
}
