type SmithyVersion = '1.0' | '2.0' | string;
type SimpleShapeType = 'string' | 'blob' | 'boolean' | 'timestamp' | 'document' | 'integer' | 'byte' | 'short' | 'float' | 'double' | 'long' | 'bigDecimal' | 'bigInteger' | 'enum';
type AggregateShapeType = 'list' | 'map' | 'union' | 'structure';
type ServiceShapeType = 'service' | 'operation' | 'resource';
type ModelShapeType = SimpleShapeType | AggregateShapeType | ServiceShapeType;
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
    type: ModelShapeType;
    traits?: Record<string, NodeValueType>;
};
type ShapeReference = {
    target: string;
};
type MemberShape = ShapeReference & {
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
    members: Record<string, MemberShape>;
};
type EnumShape = AbstractModelShape & {
    type: 'enum';
    members: Record<string, MemberShape>;
};
type StructureShape = AbstractModelShape & {
    type: 'structure';
    required?: string[];
    members: Record<string, MemberShape>;
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
type ErrorShape = StructureShape;

declare const parseModel: (model: Model) => void;
declare const getDistinctShapeTypes: (model: Model) => string[];
declare const parseServices: (model: Model) => Record<string, ServiceShape>;
declare const parseTraits: (shape: AbstractModelShape) => void;
declare const parseService: (service: ServiceShape) => void;
declare const parseServiceOperations: (service: ServiceShape) => void;

declare abstract class SmithyAstNode implements SmithyTraitsAwareInterface {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: AbstractModelShape | MemberShape;
    readonly namespace: string;
    readonly name: string;
    /**
     * Constructor.
     *
     * @param ast
     * @param shapeId
     * @param shape
     * @protected
     */
    protected constructor(ast: SmithyAst, shapeId: string, shape: AbstractModelShape | MemberShape);
    /**
     * Returns the AST instance.
     * @returns {SmithyAst}
     */
    getAst(): SmithyAst;
    /**
     * Returns the full-qualified shape ID.
     *
     * @link https://smithy.io/2.0/spec/model.html#shape-id-abnf
     * @returns {string}
     */
    getId(): string;
    /**
     * Returns the namespace of the shape.
     * @returns {string}
     */
    getNamespace(): string;
    /**
     * Returns the name of the shape without the namespace.
     * @returns {string}
     */
    getName(): string;
    /**
     * Get a list of traits applied to the shape.
     * @returns {string[]}
     */
    listTraits(): string[];
    /**
     * Get a list of trait node instances applied to the shape.
     * @returns {SmithyTrait[]}
     */
    getTraits(): SmithyTrait[];
    /**
     * Get a trait node instance by name.
     * @param traitName
     * @returns {SmithyTrait | undefined}
     */
    getTrait(traitName: string): SmithyTrait | undefined;
    /**
     * Convenience method to get the 'smithy.api#required' trait value.
     * @returns {boolean}
     */
    isRequired(): boolean;
    /**
     * Convenience method to get the 'documentation' trait value.
     * @returns {string | undefined}
     */
    getDocumentation(): string | undefined;
    /**
     * Convenience method to get the 'smithy.api#paginated' trait value.
     * @returns {SmithyTrait | undefined}
     */
    getPaginatedTrait(): SmithyTrait | undefined;
    /**
     * Convenience method to get the 'smithy.waiters#waitable' trait value.
     * @returns {SmithyTrait | undefined}
     */
    getWaitableTrait(): SmithyTrait | undefined;
}

/**
 * SmithyTrait represents a trait in the Smithy model.
 *
 * Trait index:
 * @link https://smithy.io/2.0/trait-index.html
 */
declare class SmithyTrait {
    protected readonly shape: SmithyAstNode;
    protected readonly traitId: string;
    protected readonly traitValue: any;
    static readonly AWS_ARN = "aws.api#arn";
    static readonly AWS_ARN_REFERENCE = "aws.api#arnReference";
    static readonly AWS_TAGGABLE = "aws.api#taggable";
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
    static readonly PAGINATED = "smithy.api#paginated";
    static readonly READONLY = "smithy.api#readonly";
    static readonly REQUIRED = "smithy.api#required";
    static readonly TITLE = "smithy.api#title";
    static readonly WAITABLE = "smithy.waiters#waitable";
    readonly namespace: string;
    readonly name: string;
    constructor(shape: SmithyAstNode, traitId: string, traitValue: any);
    getId(): string;
    getNamespace(): string;
    getName(): string;
    getValue(): any;
}
interface SmithyTraitsAwareInterface {
    listTraits(): string[];
    getTraits(): SmithyTrait[];
    getTrait(traitName: string): SmithyTrait | undefined;
}

declare abstract class SmithyShape extends SmithyAstNode implements SmithyTraitsAwareInterface {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: AbstractModelShape;
    readonly shapeType: string;
    protected constructor(ast: SmithyAst, shapeId: string, shape: AbstractModelShape);
    /**
     * Returns the shape type.
     */
    getShapeType(): string;
    /**
     * Returns the JSON AST representation.
     */
    getShape(): AbstractModelShape;
}

declare class SmithyMember extends SmithyAstNode implements SmithyTraitsAwareInterface {
    protected readonly parentNode: SmithyShapeWithMembers;
    readonly name: string;
    protected readonly shape: MemberShape;
    constructor(parentNode: SmithyShapeWithMembers, name: string, shape: MemberShape);
    getTarget(): string;
    getTargetShape(): AbstractModelShape | null | undefined;
    getTargetNode(): any;
}

declare class SmithyShapeWithMembers extends SmithyAggregateShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: StructureShape | UnionShape;
    constructor(ast: SmithyAst, shapeId: string, shape: StructureShape | UnionShape);
    /**
     * List the member IDs of the structure
     * @returns {string[]}
     */
    listMembers(): string[];
    /**
     * Get a map of member keys and target shape types
     * @returns {Record<string, string>}
     */
    getMemberTypes(): Record<string, string>;
    /**
     * Get the member instances of the structure
     * @returns {SmithyMember[]}
     */
    getMembers(): SmithyMember[];
    /**
     * Get a member instance by member name
     * @param memberName
     * @returns {SmithyMember | undefined}
     */
    getMember(memberName: string): SmithyMember | undefined;
}

declare class SmithyStructure extends SmithyShapeWithMembers {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: StructureShape;
    constructor(ast: SmithyAst, shapeId: string, shape: StructureShape);
    getShape(): StructureShape;
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
    getInput(): SmithyOperationInput;
    getOutputTarget(): string;
    getOutput(): SmithyOperationOutput | null;
}

declare class SmithyResource extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: ResourceShape;
    constructor(ast: SmithyAst, shapeId: string, shape: ResourceShape);
}

declare class SmithyError extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: ErrorShape;
    constructor(ast: SmithyAst, shapeId: string, shape: ErrorShape);
}

declare class SmithyService extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: ServiceShape;
    readonly version: string;
    constructor(ast: SmithyAst, shapeId: string, shape: ServiceShape);
    /**
     * Get the service id
     * @deprecated Use getName() instead
     */
    getServiceId(): string;
    /**
     * Get a list of operation IDs
     * @returns {string[]}
     */
    listOperations(): string[];
    /**
     * Get an operation instance by ID
     * @param operationId
     * @returns {SmithyResource | null}
     */
    getOperation(operationId: string): SmithyOperation | null;
    /**
     * Get a list of resource IDs
     * @returns {string[]}
     */
    listResources(): string[];
    /**
     * Get a resource instance by ID
     * @param resourceId
     * @returns {SmithyResource | null}
     */
    getResource(resourceId: string): SmithyResource | null;
    /**
     * Get a list of error IDs
     * @returns {string[]}
     */
    listErrors(): string[];
    /**
     * Get an error instance by ID
     * @param errorId
     * @returns {SmithyError | null}
     */
    getError(errorId: string): SmithyError | null;
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
     * List all resources for a service
     * @param serviceId
     */
    listServiceResources(serviceId: string): string[];
    /**
     * List all errors for a service
     * @param serviceId
     */
    listServiceErrors(serviceId: string): string[];
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
     * Get an resource instance by ID
     * @param resourceId
     */
    getResource(resourceId: string): SmithyResource | null;
    buildNodeFromModelShape(shapeId: string, shape: AbstractModelShape): SmithyShape;
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
    static nodeFromModelShape(ast: SmithyAst, shapeId: string, shape: AbstractModelShape): SmithyShape;
}

declare abstract class SmithyAggregateShape extends SmithyShape {
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

/**
 * !!! EXPERIMENTAL !!!
 * Convert a Smithy AST to a Smithy document
 * @todo This is a work in progress and not yet complete
 */
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

declare class SmithyList extends SmithyAggregateShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: ListShape;
    constructor(ast: SmithyAst, shapeId: string, shape: ListShape);
    getMemberType(): string;
}

declare class SmithyMap extends SmithyAggregateShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: MapShape;
    constructor(ast: SmithyAst, shapeId: string, shape: MapShape);
    /**
     * Returns the type of the keys in the map.
     * @returns {string}
     */
    getKeyType(): string;
    /**
     * Returns the type of the values in the map.
     * @returns {string}
     */
    getValueType(): string;
}

declare class SmithySimpleShape extends SmithyShape {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: AbstractModelShape;
    constructor(ast: SmithyAst, shapeId: string, shape: AbstractModelShape);
}

declare class SmithyUnion extends SmithyShapeWithMembers {
    protected readonly ast: SmithyAst;
    protected readonly shapeId: string;
    protected readonly shape: UnionShape;
    constructor(ast: SmithyAst, shapeId: string, shape: UnionShape);
    getShape(): UnionShape;
}

export { type AbstractModelShape, type AggregateShapeType, type EnumShape, type ErrorShape, type ListShape, type MapShape, type MemberShape, type Model, type ModelMetadata, type ModelShapeType, type NodeValue, type NodeValueType, type OperationShape, type ResourceShape, type ServiceShape, type ServiceShapeType, type ShapeReference, type SimpleShapeType, SmithyAggregateShape, SmithyAst, SmithyAstConverter, SmithyAstNode, SmithyEnum, SmithyError, SmithyList, SmithyMap, SmithyMember, SmithyOperation, SmithyResource, SmithyService, SmithyShape, SmithyShapeWithMembers, SmithySimpleShape, SmithyStructure, SmithyTrait, type SmithyTraitsAwareInterface, SmithyUnion, type SmithyVersion, type StructureShape, type UnionShape, getDistinctShapeTypes, parseModel, parseService, parseServiceOperations, parseServices, parseTraits };
