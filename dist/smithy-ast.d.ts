type SmithyModel = {
    smithy?: string;
    metadaata?: any;
    shapes: {
        [key: string]: ModelShape;
    };
    operations?: any;
};
type ShapeTypes = 'structure' | 'service' | 'operation' | 'resource' | 'enum' | 'string' | 'list' | 'union' | 'map' | 'blob' | 'boolean' | 'timestamp' | 'document' | 'integer' | 'byte' | 'short' | 'float' | 'double' | 'long' | 'bigDecimal' | 'bigInteger';
type ModelShape = {
    type: ShapeTypes;
    traits?: Record<string, any>;
};
type ShapeReference = {
    target: string;
};
type Member = ShapeReference & {
    traits?: Record<string, any>;
};
type ListShape = ModelShape & {
    type: 'list';
    member: ShapeReference;
};
type MapShape = ModelShape & {
    type: 'map';
    key: ShapeReference;
    value: ShapeReference;
};
type UnionShape = ModelShape & {
    type: 'union';
    members: Record<string, Member>;
};
type EnumShape = ModelShape & {
    type: 'enum';
    members: Record<string, Member>;
};
type StructureShape = ModelShape & {
    type: 'structure';
    required?: string[];
    members: Record<string, Member>;
};
type ServiceShape = ModelShape & {
    type: 'service';
    version: string;
    operations: Record<string, ShapeReference>;
    resources: Record<string, ShapeReference>;
    errors?: Record<string, ShapeReference>;
};
type OperationShape = ModelShape & {
    type: 'operation';
    input: ShapeReference;
    output: ShapeReference;
    errors?: Record<string, ShapeReference>;
};
type ResourceShape = ModelShape & {
    type: 'resource';
    identifiers: Record<string, ShapeReference>;
    properties: Record<string, ShapeReference>;
    create?: ShapeReference;
    read?: ShapeReference;
    update?: ShapeReference;
    delete?: ShapeReference;
    list?: ShapeReference;
    put?: ShapeReference;
    operations?: ShapeReference[];
    collectionOperations?: ShapeReference[];
};

declare const parseModel: (model: SmithyModel) => void;
declare const getDistinctShapeTypes: (model: SmithyModel) => string[];
declare const parseServices: (model: SmithyModel) => Record<string, ServiceShape>;
declare const parseTraits: (shape: ModelShape) => void;
declare const parseService: (service: ServiceShape) => void;
declare const parseServiceOperations: (service: ServiceShape) => void;

declare class SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: ModelShape;
    readonly namespace: string;
    readonly name: string;
    readonly shapeType: string;
    constructor(ast: SmithyAst, shapeId: string, shape: ModelShape);
    getNamespace(): string;
    getName(): string;
    getShapeType(): string;
    getShape(): ModelShape;
}

declare class SmithyStructure extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: ModelShape;
    constructor(ast: SmithyAst, shapeId: string, shape: ModelShape);
}

declare class SmithyOperationInput extends SmithyStructure {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    private readonly input;
    constructor(ast: SmithyAst, shapeId: string, input: StructureShape);
}
declare class SmithyOperationOutput extends SmithyStructure {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    private readonly output;
    constructor(ast: SmithyAst, shapeId: string, output: StructureShape);
}
declare class SmithyOperation extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly operation: OperationShape;
    constructor(ast: SmithyAst, shapeId: string, operation: OperationShape);
    getInputTarget(): string;
    getOutputTarget(): string;
    getInput(): SmithyOperationInput;
    getOutput(): SmithyOperationOutput;
    toSmithy(): string;
}

declare class SmithyService extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly service: ServiceShape;
    readonly version: string;
    constructor(ast: SmithyAst, shapeId: string, service: ServiceShape);
    getNamespace(): string;
    /**
     * Get the service id
     * @deprecated Use getName() instead
     */
    getServiceId(): string;
    listOperations(): string[];
    listResources(): string[];
    getOperation(operationId: string): SmithyOperation | null;
}

declare class SmithyAst {
    private readonly model;
    constructor(model: SmithyModel);
    /**
     * Get the raw model
     */
    getModel(): SmithyModel;
    /**
     * List all services in the model
     */
    listServices(): string[];
    /**
     * List all operations for a service
     * @param serviceId
     */
    listServiceOperations(serviceId: string): string[];
    /**
     * Get a shape by ID
     * @param shapeId
     */
    getShape(shapeId: string): ModelShape | undefined;
    /**
     * Get a shape by ref
     * @param ref
     */
    getShapeByRef(ref: ShapeReference): ModelShape | undefined;
    /**
     * Get a service by ID
     * @param serviceId
     */
    getServiceShape(serviceId: string): ServiceShape | undefined;
    /**
     * Get an operation by ID
     * @param operationId
     */
    getOperationShape(operationId: string): OperationShape | undefined;
    /**
     * Get the input shape for an operation
     * @param operation
     * @deprecated Use SmithyOperation.getInput().getShape() instead
     */
    getOperationInputShape(operation: OperationShape): StructureShape;
    /**
     * Get the output shape for an operation
     * @param operation
     * @deprecated Use SmithyOperation.getOutput().getShape() instead
     */
    getOperationOutputShape(operation: OperationShape): StructureShape;
    /**
     * Get a service instance by ID
     * @param serviceId
     */
    getService(serviceId: string): SmithyService | null;
    /**
     * Get an operation instance by ID
     * @param operationId
     */
    getOperation(operationId: string): SmithyOperation | null;
    /**
     * Create a SmithyAst from a JSON string
     * @param json
     */
    static fromJson(json: string): SmithyAst;
    /**
     * Create a SmithyAst from a model
     * @param model
     */
    static fromModel(model: SmithyModel): SmithyAst;
}

declare class SmithyAggregateShape extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: ModelShape;
    constructor(ast: SmithyAst, shapeId: string, shape: ModelShape);
}

declare class SmithyEnum extends SmithyShape {
    protected readonly ast: SmithyAst;
    readonly shapeId: string;
    protected readonly shape: EnumShape;
    constructor(ast: SmithyAst, shapeId: string, shape: EnumShape);
    getMembers(): Record<string, string | undefined>;
}

declare class SmithyAstConverter {
    private readonly ast;
    constructor(ast: SmithyAst);
    toSmithy(): string;
    /**
     * Render a service to Smithy
     *
     * @param service
     * @protected
     */
    protected renderService(service: SmithyService): string;
    /**
     * Render an operation to Smithy
     *
     * @param operation
     * @protected
     */
    protected renderOperation(operation: SmithyOperation): string;
    /**
     * Render a shape to Smithy
     *
     * @param shapeInstance
     * @protected
     */
    protected renderShape(shapeInstance: SmithyShape): string;
    /**
     * Render a shape to Smithy
     *
     * @param shape
     * @protected
     */
    protected renderSimpleShape(shape: SmithyShape): string;
    protected renderEnumShape(shape: SmithyEnum): string;
    /**
     * Render an aggregate shape to Smithy
     *
     * @param shape
     * @protected
     */
    protected renderAggregateShape(shape: SmithyAggregateShape): string;
    /**
     * Render a structure shape to Smithy
     *
     * @param shape
     * @protected
     */
    protected renderStructureShape(shape: SmithyStructure): string;
}

export { type EnumShape, type ListShape, type MapShape, type Member, type ModelShape, type OperationShape, type ResourceShape, type ServiceShape, type ShapeReference, type ShapeTypes, SmithyAggregateShape, SmithyAst, SmithyAstConverter, SmithyEnum, type SmithyModel, SmithyOperation, SmithyService, SmithyShape, SmithyStructure, type StructureShape, type UnionShape, getDistinctShapeTypes, parseModel, parseService, parseServiceOperations, parseServices, parseTraits };
