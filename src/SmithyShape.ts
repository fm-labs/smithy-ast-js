import { SmithyAst } from './SmithyAst.js'
import { AbstractModelShape } from './types.js'
import { SmithyTrait } from './SmithyTrait.js'

export class SmithyShape {
  public readonly namespace: string
  public readonly name: string
  public readonly shapeType: string

  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: AbstractModelShape,
  ) {
    this.namespace = shapeId.split('#')[0]
    this.name = shapeId.split('#')[1]
    this.shapeType = shape.type
  }

  public getNamespace(): string {
    return this.namespace
  }

  public getName(): string {
    return this.name
  }

  public getShapeType(): string {
    return this.shapeType
  }

  public getShape(): AbstractModelShape {
    return this.shape
  }

  public listTraits(): string[] {
    if (!this.shape.traits) {
      return []
    }
    return Object.keys(this.shape.traits)
  }

  public getTraits(): SmithyTrait[] {
    if (!this.shape.traits) {
      return []
    }
    return Object.entries(this.shape.traits).map(([traitName, traitValue]) => {
      return new SmithyTrait(this, traitName, traitValue)
    })
  }

  public getTrait(traitName: string): SmithyTrait | undefined {
    if (!this.shape.traits) {
      return undefined
    }
    const trait = Object.entries(this.shape.traits).find(([key]) => key === traitName)
    if (!trait) {
      return undefined
    }
    return new SmithyTrait(this, trait[0], trait[1])
  }
}
