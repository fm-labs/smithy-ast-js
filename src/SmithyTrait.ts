import { SmithyShape } from './SmithyShape.js'
import { SmithyStructureMember } from './SmithyStructure.js'

/**
 * SmithyTrait represents a trait in the Smithy model.
 *
 * Trait index:
 * @link https://smithy.io/2.0/trait-index.html
 */
export class SmithyTrait {
  // common traits - incomplete list of known traits
  static readonly AUTH = 'smithy.api#auth'
  static readonly CORS = 'smithy.api#cors'
  static readonly DEFAULT = 'smithy.api#default'
  static readonly DEPRECATED = 'smithy.api#deprecated'
  static readonly DOCUMENTATION = 'smithy.api#documentation'
  static readonly ENDPOINT = 'smithy.api#endpoint'
  static readonly ENUM = 'smithy.api#enum'
  static readonly ENUM_VALUE = 'smithy.api#enumValue'
  static readonly ERROR = 'smithy.api#error'
  static readonly EXAMPLES = 'smithy.api#examples'
  static readonly INPUT = 'smithy.api#input'
  static readonly INTERNAL = 'smithy.api#internal'
  static readonly JSON_NAME = 'smithy.api#jsonName'
  static readonly LENGTH = 'smithy.api#length'
  static readonly OUTPUT = 'smithy.api#output'
  static readonly READONLY = 'smithy.api#readonly'
  static readonly REQUIRED = 'smithy.api#required'
  static readonly TITLE = 'smithy.api#title'

  public readonly namespace: string
  public readonly name: string

  constructor(
    protected readonly shape: SmithyShape | SmithyStructureMember,
    protected readonly traitId: string,
    protected readonly traitValue: any,
  ) {
    if (!traitId.includes('#')) {
      this.traitId = `smithy.api#${traitId}`
    }
    this.namespace = traitId.split('#')[0]
    this.name = traitId.split('#')[1]
  }

  public getId(): string {
    return this.traitId
  }

  public getNamespace(): string {
    return this.namespace
  }

  public getName(): string {
    return this.name
  }

  public getValue(): any {
    return this.traitValue
  }
}
