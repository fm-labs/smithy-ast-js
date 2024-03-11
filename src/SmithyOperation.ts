import { OperationShape, StructureShape } from './types.js'
import { SmithyAst } from './SmithyAst.js'
import { SmithyShape } from './SmithyShape.js'
import { SmithyStructure } from './SmithyStructure.js'

class SmithyOperationInput extends SmithyStructure {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    private readonly input: StructureShape,
  ) {
    super(ast, shapeId, input)
  }
}

class SmithyOperationOutput extends SmithyStructure {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    private readonly output: StructureShape,
  ) {
    super(ast, shapeId, output)
  }
}

export class SmithyOperation extends SmithyShape {
  constructor(
    protected readonly ast: SmithyAst,
    protected readonly shapeId: string,
    protected readonly operation: OperationShape,
  ) {
    super(ast, shapeId, operation)
  }

  public getInputTarget() {
    return this.operation.input.target
  }

  public getInput() {
    const inputShapeId = this.operation.input.target
    const inputShape = this.ast.getShape(inputShapeId) as StructureShape
    if (inputShape === null) {
      return inputShape
    } else if (!inputShape) {
      throw new Error(`Input shape not found: ${inputShapeId}`)
    }
    return new SmithyOperationInput(this.ast, inputShapeId, inputShape)
  }

  public getOutputTarget() {
    return this.operation.output.target
  }

  public getOutput() {
    const outputShapeId = this.operation.output.target
    const outputShape = this.ast.getShape(outputShapeId) as StructureShape
    if (outputShape === null) {
      return null
    } else if (!outputShape) {
      throw new Error(`Input shape not found: ${outputShapeId}`)
    }
    return new SmithyOperationOutput(this.ast, outputShapeId, outputShape)
  }
}
