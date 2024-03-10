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

  public getOutputTarget() {
    return this.operation.output.target
  }

  public getInput() {
    const inputShapeId = this.operation.input.target
    return new SmithyOperationInput(
      this.ast,
      inputShapeId,
      this.ast.getShape(inputShapeId) as StructureShape,
    )
  }

  public getOutput() {
    const outputShapeId = this.operation.output.target
    return new SmithyOperationOutput(
      this.ast,
      outputShapeId,
      this.ast.getShape(outputShapeId) as StructureShape,
    )
  }

  public toSmithy(): string {
    // const lifecycleTrait = ''
    // if (this.operationId.startsWith('Create')) {
    //   lifecycleTrait = 'create'
    // } else if (this.operationId.startsWith('Read')) {
    //   lifecycleTrait = 'read'
    // } else if (this.operationId.startsWith('Update')) {
    //   lifecycleTrait = 'update'
    // }

    const input = this.operation.input.target.split('#')[1]
    const output = this.operation.output.target.split('#')[1]

    return `
operation ${this.name} {
  input: ${input}
  output: ${output}
}`
  }
}
