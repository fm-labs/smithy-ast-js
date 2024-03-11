import { SmithyAst } from './SmithyAst.js'
import { ShapeMember, AbstractModelShape, StructureShape } from './types.js'
import { SmithyShape } from './SmithyShape.js'
import { SmithyTrait } from './SmithyTrait.js'

export class SmithyStructure extends SmithyShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: StructureShape,
  ) {
    super(ast, shapeId, shape)
  }

  public getShape(): AbstractModelShape {
    return this.shape
  }

  public listMembers(): string[] {
    return Object.keys(this.shape.members)
  }

  public getMembers(): SmithyStructureMember[] {
    return Object.entries(this.shape.members).map(([memberName, memberShape]) => {
      return new SmithyStructureMember(this.ast, memberName, memberShape)
    })
  }

  public getMember(memberName: string): SmithyStructureMember | undefined {
    const member = this.shape.members[memberName]
    if (!member) {
      return undefined
    }
    return new SmithyStructureMember(this.ast, memberName, member)
  }

  //   public toSmithy(): string {
  //     return `
  // structure ${this.name} {
  // }`
  //   }
}

export class SmithyStructureMember {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly memberId: string,
    protected readonly member: ShapeMember,
  ) {}

  public getName(): string {
    return this.memberId
  }

  public getTarget(): string {
    return this.member.target
  }

  public getShape(): AbstractModelShape | null | undefined {
    return this.ast.getShape(this.member.target)
  }

  public listTraits(): string[] {
    if (!this.member.traits) {
      return []
    }
    return Object.keys(this.member.traits)
  }

  public getTraits(): SmithyTrait[] {
    if (!this.member.traits) {
      return []
    }
    return Object.entries(this.member.traits).map(([traitName, traitValue]) => {
      return new SmithyTrait(this, traitName, traitValue)
    })
  }

  public getTrait(traitName: string): SmithyTrait | undefined {
    if (!this.member.traits) {
      return undefined
    }
    const trait = Object.entries(this.member.traits).find(([key]) => key === traitName)
    if (!trait) {
      return undefined
    }
    return new SmithyTrait(this, trait[0], trait[1])
  }
}
