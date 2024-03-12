import { SmithyAst } from './SmithyAst.js'
import {
  EnumShape,
  ListShape,
  MapShape,
  OperationShape,
  ServiceShape,
  StructureShape,
  UnionShape,
} from './types.js'
import { SmithyService } from './SmithyService.js'
import { SmithyStructure } from './SmithyStructure.js'
import { SmithyEnum } from './SmithyEnum.js'
import { SmithyAggregateShape } from './SmithyAggregateShape.js'
import { SmithyShape } from './SmithyShape.js'
import { SmithyOperation } from './SmithyOperation.js'
import { SmithyList } from './SmithyList.js'
import { SmithyMap } from './SmithyMap.js'
import { SmithyUnion } from './SmithyUnion.js'
import { SmithySimpleShape } from './SmithySimpleShape.js'

/**
 * !!! EXPERIMENTAL !!!
 * Convert a Smithy AST to a Smithy document
 * @todo This is a work in progress and not yet complete
 */
export class SmithyAstConverter {
  constructor(private readonly ast: SmithyAst) {}

  public toSmithy(): string {
    // shapes
    const model = this.ast.getModel()
    const shapesSmithy = Object.keys(model.shapes)
      .filter(
        (shapeId) =>
          model.shapes[shapeId].type !== 'operation' &&
          model.shapes[shapeId].type !== 'service' &&
          model.shapes[shapeId].type !== 'resource',
      )
      .map((shapeId) => {
        switch (model.shapes[shapeId].type) {
          case 'structure':
            return new SmithyStructure(this.ast, shapeId, model.shapes[shapeId] as StructureShape)
          case 'enum':
            return new SmithyEnum(this.ast, shapeId, model.shapes[shapeId] as EnumShape)
          case 'list':
            return new SmithyList(this.ast, shapeId, model.shapes[shapeId] as ListShape)
          case 'map':
            return new SmithyMap(this.ast, shapeId, model.shapes[shapeId] as MapShape)
          case 'union':
            return new SmithyUnion(this.ast, shapeId, model.shapes[shapeId] as UnionShape)
          case 'blob':
          case 'boolean':
          case 'string':
          case 'byte':
          case 'short':
          case 'integer':
          case 'long':
          case 'float':
          case 'double':
          case 'bigInteger':
          case 'bigDecimal':
          case 'timestamp':
          case 'document':
            return new SmithySimpleShape(this.ast, shapeId, model.shapes[shapeId])
          default:
            throw new Error(`Unknown shape type: ${model.shapes[shapeId].type}`)
        }
      })
      .map((shapeInstance: SmithyShape) => {
        return this.renderShape(shapeInstance)
      })

    const services = this.ast.listServices()
    let namespace
    let servicesSmithy = ''
    for (const service of services) {
      const serviceInstance = new SmithyService(
        this.ast,
        service,
        this.ast.getShape(service) as ServiceShape,
      )
      namespace = serviceInstance.getNamespace()
      //servicesSmithy += serviceInstance.toSmithy()
      servicesSmithy += this.renderService(serviceInstance)
    }
    return `
$version: "2"
namespace ${namespace}

${shapesSmithy.join('\n')}

${servicesSmithy}
`
  }

  /**
   * Render a service to Smithy
   *
   * @param service
   * @protected
   */
  protected renderService(service: SmithyService): string {
    // operations
    const operations = service.listOperations()
    const operationInstances = operations.map((operationId) => {
      return new SmithyOperation(
        this.ast,
        operationId,
        this.ast.getShape(operationId) as OperationShape,
      )
    })

    const operationStrings = operationInstances.map((operation) => {
      //return operation.toSmithy()
      return this.renderOperation(operation)
    })
    const operationIds = operations.map((operation) => {
      return operation.split('#')[1]
    })

    return `
service ${service.name} {
  version: "${service.version}"
  operations: [${operationIds.join(',')}]
  resources: [] // @todo
}

${operationStrings.join('\n\n')}
`
  }

  /**
   * Render an operation to Smithy
   *
   * @param operation
   * @protected
   */
  protected renderOperation(operation: SmithyOperation): string {
    const input = operation.getInputTarget().split('#')[1]
    const output = operation.getOutputTarget().split('#')[1]

    return `
operation ${operation.name} {
  input: ${input}
  output: ${output}
}`
  }

  /**
   * Render a shape to Smithy
   *
   * @param shapeInstance
   * @protected
   */
  protected renderShape(shapeInstance: SmithyShape): string {
    if (shapeInstance instanceof SmithyEnum) {
      return this.renderEnumShape(shapeInstance)
    } else if (shapeInstance instanceof SmithyStructure) {
      return this.renderStructureShape(shapeInstance)
    } else if (shapeInstance instanceof SmithyAggregateShape) {
      return this.renderAggregateShape(shapeInstance)
    } else {
      return this.renderSimpleShape(shapeInstance)
    }
  }

  /**
   * Render a shape to Smithy
   *
   * @param shape
   * @protected
   */
  protected renderSimpleShape(shape: SmithyShape): string {
    return `
${shape.shapeType} ${shape.name}`
  }

  protected renderEnumShape(shape: SmithyEnum): string {
    const enumMembers = Object.entries(shape.getMembers()).map(([key, value]) => {
      return `
    ${value ? '@enumValue("' + value + '")' : ''}
    ${key}`
    })

    return `
${shape.shapeType} ${shape.name} {
${enumMembers.join('\n')}
}`
  }

  /**
   * Render an aggregate shape to Smithy
   *
   * @param shape
   * @protected
   */
  protected renderAggregateShape(shape: SmithyAggregateShape): string {
    // list
    if (shape.shapeType === 'list') {
      const _shape = shape.getShape() as ListShape
      const member = _shape.member.target.split('#')[1]
      return `
${shape.shapeType} ${shape.name} {
  member: ${member}
}`
    }

    // map
    if (shape.shapeType === 'map') {
      const _shape = shape.getShape() as MapShape
      const key = _shape.key.target.split('#')[1]
      const value = _shape.value.target.split('#')[1]
      return `
${shape.shapeType} ${shape.name} {
  key: ${key}
  value: ${value}
}`
    }

    // union
    if (shape.shapeType === 'union') {
      const _shape = shape.getShape() as UnionShape
      const membersStr = Object.entries(_shape.members).map(([key, value]) => {
        const member = value.target.split('#')[1]
        return `  ${key}: ${member}`
      })
      return `
${shape.shapeType} ${shape.name} {
${membersStr.join('\n')}
}`
    }

    return `
//@todo UNSUPPORTED TYPE ${shape.shapeType} ${shape.name} {}`
  }

  /**
   * Render a structure shape to Smithy
   *
   * @param shape
   * @protected
   */
  protected renderStructureShape(shape: SmithyStructure): string {
    return `
structure ${shape.name} {
  // @todo add structure members
}`
  }
}
