type SmithyVersion = '1.0' | '2.0' | string;
type ModelShapeTypes = 'structure' | 'service' | 'operation' | 'resource' | 'enum' | 'string' | 'list' | 'union' | 'map' | 'blob' | 'boolean' | 'timestamp' | 'document' | 'integer' | 'byte' | 'short' | 'float' | 'double' | 'long' | 'bigDecimal' | 'bigInteger';
type NodeValue = number | string | boolean;
type NodeValueType = NodeValue | NodeValue[] | Record<string, NodeValue>;
type ModelMetadata = {
    [key: string]: NodeValueType;
};
type Model = {
    metadaata?: ModelMetadata;
    smithy: SmithyVersion;
    shapes: {
        [key: string]: AbstractModelShape;
    };
};
type AbstractModelShape = {
    type: ModelShapeTypes;
    traits?: Record<string, NodeValueType>;
};
type ShapeReference = {
    target: string;
};
type ShapeMember = ShapeReference & {
    traits?: Record<string, NodeValueType>;
};
type ListShape = AbstractModelShape & {
    type: 'list';
    member: ShapeReference;
};
type MapShape = AbstractModelShape & {
    type: 'map';
    key: ShapeReference;
    value: ShapeReference;
};
type UnionShape = AbstractModelShape & {
    type: 'union';
    members: Record<string, ShapeMember>;
};
type EnumShape = AbstractModelShape & {
    type: 'enum';
    members: Record<string, ShapeMember>;
};
type StructureShape = AbstractModelShape & {
    type: 'structure';
    required?: string[];
    members: Record<string, ShapeMember>;
};
type ServiceShape = AbstractModelShape & {
    type: 'service';
    version: string;
    operations: Record<string, ShapeReference>;
    resources: Record<string, ShapeReference>;
    errors?: Record<string, ShapeReference>;
};
type OperationShape = AbstractModelShape & {
    type: 'operation';
    input: ShapeReference;
    output: ShapeReference;
    errors?: Record<string, ShapeReference>;
};
type ResourceShape = AbstractModelShape & {
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

declare const parseModel: (model: Model) => void;
declare const getDistinctShapeTypes: (model: Model) => string[];
declare const parseServices: (model: Model) => Record<string, ServiceShape>;
declare const parseTraits: (shape: AbstractModelShape) => void;
declare const parseService: (service: ServiceShape) => void;
declare const parseServiceOperations: (service: ServiceShape) => void;

declare class SmithyStructure extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: StructureShape;
    constructor(ast: SmithyAst, shapeId: string, shape: StructureShape);
    getShape(): AbstractModelShape;
    listMembers(): string[];
    getMembers(): SmithyStructureMember[];
    getMember(memberName: string): SmithyStructureMember | undefined;
}
declare class SmithyStructureMember {
    protected readonly ast: SmithyAst;
    protected readonly memberId: string;
    protected readonly member: ShapeMember;
    constructor(ast: SmithyAst, memberId: string, member: ShapeMember);
    getName(): string;
    getTarget(): string;
    getShape(): AbstractModelShape | null | undefined;
    listTraits(): string[];
    getTraits(): SmithyTrait[];
    getTrait(traitName: string): SmithyTrait | undefined;
}

/**
 * SmithyTrait represents a trait in the Smithy model.
 *
 * Trait index:
 * @link https://smithy.io/2.0/trait-index.html
 */
declare class SmithyTrait {
    protected readonly shape: SmithyShape | SmithyStructureMember;
    protected readonly traitId: string;
    protected readonly traitValue: any;
    static readonly AUTH = "smithy.api#auth";
    static readonly CORS = "smithy.api#cors";
    static readonly DEFAULT = "smithy.api#default";
    static readonly DEPRECATED = "smithy.api#deprecated";
    static readonly DOCUMENTATION = "smithy.api#documentation";
    static readonly ENDPOINT = "smithy.api#endpoint";
    static readonly ENUM = "smithy.api#enum";
    static readonly ENUM_VALUE = "smithy.api#enumValue";
    static readonly ERROR = "smithy.api#error";
    static readonly EXAMPLES = "smithy.api#examples";
    static readonly INPUT = "smithy.api#input";
    static readonly INTERNAL = "smithy.api#internal";
    static readonly JSON_NAME = "smithy.api#jsonName";
    static readonly LENGTH = "smithy.api#length";
    static readonly OUTPUT = "smithy.api#output";
    static readonly READONLY = "smithy.api#readonly";
    static readonly REQUIRED = "smithy.api#required";
    static readonly TITLE = "smithy.api#title";
    readonly namespace: string;
    readonly name: string;
    constructor(shape: SmithyShape | SmithyStructureMember, traitId: string, traitValue: any);
    getId(): string;
    getNamespace(): string;
    getName(): string;
    getValue(): any;
}

declare class SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: AbstractModelShape;
    readonly namespace: string;
    readonly name: string;
    readonly shapeType: string;
    constructor(ast: SmithyAst, shapeId: string, shape: AbstractModelShape);
    getNamespace(): string;
    getName(): string;
    getShapeType(): string;
    getShape(): AbstractModelShape;
    listTraits(): string[];
    getTraits(): SmithyTrait[];
    getTrait(traitName: string): SmithyTrait | undefined;
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
    getOutput(): SmithyOperationOutput | null;
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
    constructor(model: Model);
    /**
     * Get the raw model
     */
    getModel(): Model;
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
    getShape(shapeId: string): AbstractModelShape | null | undefined;
    /**
     * Get a shape by ref
     * @param ref
     */
    getShapeByRef(ref: ShapeReference): AbstractModelShape | undefined;
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
    static fromModel(model: Model): SmithyAst;
}

declare class SmithyAggregateShape extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: AbstractModelShape;
    constructor(ast: SmithyAst, shapeId: string, shape: AbstractModelShape);
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

export { type AbstractModelShape, type EnumShape, type ListShape, type MapShape, type Model, type ModelMetadata, type ModelShapeTypes, type NodeValue, type NodeValueType, type OperationShape, type ResourceShape, type ServiceShape, type ShapeMember, type ShapeReference, SmithyAggregateShape, SmithyAst, SmithyAstConverter, SmithyEnum, SmithyOperation, SmithyService, SmithyShape, SmithyStructure, SmithyStructureMember, SmithyTrait, type SmithyVersion, type StructureShape, type UnionShape, getDistinctShapeTypes, parseModel, parseService, parseServiceOperations, parseServices, parseTraits };
