import { SmithyAst } from './SmithyAst.js'
import {
  AbstractModelShape,
  EnumShape,
  ListShape,
  MapShape,
  MemberShape,
  StructureShape,
  UnionShape,
} from './types.js'
import { SmithyTrait, SmithyTraitsAwareInterface } from './SmithyTrait.js'
import { SmithyStructure } from './SmithyStructure.js'
import { SmithyEnum } from './SmithyEnum.js'
import { SmithyList } from './SmithyList.js'
import { SmithyMap } from './SmithyMap.js'
import { SmithyUnion } from './SmithyUnion.js'
import { SmithySimpleShape } from './SmithySimpleShape.js'

export abstract class SmithyAstNode implements SmithyTraitsAwareInterface {
  public readonly namespace: string
  public readonly name: string

  /**
   * Constructor.
   *
   * @param ast
   * @param shapeId
   * @param shape
   * @protected
   */
  protected constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly shape: AbstractModelShape | MemberShape,
  ) {
    this.namespace = shapeId.split('#')[0]
    this.name = shapeId.split('#')[1]
  }

  /**
   * Returns the AST instance.
   * @returns {SmithyAst}
   */
  public getAst(): SmithyAst {
    return this.ast
  }

  /**
   * Returns the full-qualified shape ID.
   *
   * @link https://smithy.io/2.0/spec/model.html#shape-id-abnf
   * @returns {string}
   */
  public getId(): string {
    return this.shapeId
  }

  /**
   * Returns the namespace of the shape.
   * @returns {string}
   */
  public getNamespace(): string {
    return this.namespace
  }

  /**
   * Returns the name of the shape without the namespace.
   * @returns {string}
   */
  public getName(): string {
    return this.name
  }

  /**
   * Get a list of traits applied to the shape.
   * @returns {string[]}
   */
  public listTraits(): string[] {
    if (!this.shape.traits) {
      return []
    }
    return Object.keys(this.shape.traits)
  }

  /**
   * Get a list of trait node instances applied to the shape.
   * @returns {SmithyTrait[]}
   */
  public getTraits(): SmithyTrait[] {
    if (!this.shape.traits) {
      return []
    }
    return Object.entries(this.shape.traits).map(([traitName, traitValue]) => {
      return new SmithyTrait(this, traitName, traitValue)
    })
  }

  /**
   * Get a trait node instance by name.
   * @param traitName
   * @returns {SmithyTrait | undefined}
   */
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

  /**
   * Convenience method to get the 'smithy.api#required' trait value.
   * @returns {boolean}
   */
  public isRequired(): boolean {
    const trait = this.getTrait(SmithyTrait.REQUIRED)
    return !!trait
  }

  /**
   * Convenience method to get the 'documentation' trait value.
   * @returns {string | undefined}
   */
  public getDocumentation(): string | undefined {
    const trait = this.getTrait(SmithyTrait.DOCUMENTATION)
    return trait?.getValue()
  }

  /**
   * Convenience method to get the 'smithy.api#paginated' trait value.
   * @returns {SmithyTrait | undefined}
   */
  public getPaginatedTrait(): SmithyTrait | undefined {
    return this.getTrait(SmithyTrait.PAGINATED)
  }

  /**
   * Convenience method to get the 'smithy.waiters#waitable' trait value.
   * @returns {SmithyTrait | undefined}
   */
  public getWaitableTrait(): SmithyTrait | undefined {
    return this.getTrait(SmithyTrait.WAITABLE)
  }
}
