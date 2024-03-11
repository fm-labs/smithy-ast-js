(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["smithy-ast"] = {}));
})(this, (function (exports) { 'use strict';

    const parseModel = (model) => {
        console.log(Object.keys(model));
        console.log('Smithy version:', model.smithy);
        for (const shapeId in model.shapes) {
            const shape = model.shapes[shapeId];
            console.log(`found shape [${shape.type}] with ID ${shapeId}`);
            //console.log(shape)
        }
    };
    const getDistinctShapeTypes = (model) => {
        const types = new Set();
        for (const shapeId in model.shapes) {
            const shape = model.shapes[shapeId];
            if (types.has(shape.type)) {
                continue;
            }
            types.add(shape.type);
        }
        return Array.from(types.values());
    };
    const parseServices = (model) => {
        const services = {};
        for (const shapeId in model.shapes) {
            const shape = model.shapes[shapeId];
            if (shape.type === 'service') {
                const service = shape;
                services[shapeId] = service;
                console.log('found service:', shapeId, service.version);
                parseService(service);
            }
        }
        return services;
    };
    const parseTraits = (shape) => {
        if (shape.traits) {
            console.log('traits:', shape.traits);
            for (const trait in shape.traits) {
                console.log(`> found trait [${trait}]`);
            }
        }
    };
    const parseService = (service) => {
        console.log(service);
        parseTraits(service);
        parseServiceOperations(service);
    };
    const parseServiceOperations = (service) => {
        for (const operationIdx in service.operations) {
            const operationRef = service.operations[operationIdx];
            console.log('found operation:', operationRef.target);
            //parseOperation(operation)
        }
    };

    /**
     * SmithyTrait represents a trait in the Smithy model.
     *
     * Trait index:
     * @link https://smithy.io/2.0/trait-index.html
     */
    class SmithyTrait {
        shape;
        traitId;
        traitValue;
        // common traits - incomplete list of known traits
        static AUTH = 'smithy.api#auth';
        static CORS = 'smithy.api#cors';
        static DEFAULT = 'smithy.api#default';
        static DEPRECATED = 'smithy.api#deprecated';
        static DOCUMENTATION = 'smithy.api#documentation';
        static ENDPOINT = 'smithy.api#endpoint';
        static ENUM = 'smithy.api#enum';
        static ENUM_VALUE = 'smithy.api#enumValue';
        static ERROR = 'smithy.api#error';
        static EXAMPLES = 'smithy.api#examples';
        static INPUT = 'smithy.api#input';
        static INTERNAL = 'smithy.api#internal';
        static JSON_NAME = 'smithy.api#jsonName';
        static LENGTH = 'smithy.api#length';
        static OUTPUT = 'smithy.api#output';
        static READONLY = 'smithy.api#readonly';
        static REQUIRED = 'smithy.api#required';
        static TITLE = 'smithy.api#title';
        namespace;
        name;
        constructor(shape, traitId, traitValue) {
            this.shape = shape;
            this.traitId = traitId;
            this.traitValue = traitValue;
            if (!traitId.includes('#')) {
                this.traitId = `smithy.api#${traitId}`;
            }
            this.namespace = traitId.split('#')[0];
            this.name = traitId.split('#')[1];
        }
        getId() {
            return this.traitId;
        }
        getNamespace() {
            return this.namespace;
        }
        getName() {
            return this.name;
        }
        getValue() {
            return this.traitValue;
        }
    }

    class SmithyShape {
        ast;
        shapeId;
        shape;
        namespace;
        name;
        shapeType;
        constructor(ast, shapeId, shape) {
            this.ast = ast;
            this.shapeId = shapeId;
            this.shape = shape;
            this.namespace = shapeId.split('#')[0];
            this.name = shapeId.split('#')[1];
            this.shapeType = shape.type;
        }
        getNamespace() {
            return this.namespace;
        }
        getName() {
            return this.name;
        }
        getShapeType() {
            return this.shapeType;
        }
        getShape() {
            return this.shape;
        }
        listTraits() {
            if (!this.shape.traits) {
                return [];
            }
            return Object.keys(this.shape.traits);
        }
        getTraits() {
            if (!this.shape.traits) {
                return [];
            }
            return Object.entries(this.shape.traits).map(([traitName, traitValue]) => {
                return new SmithyTrait(this, traitName, traitValue);
            });
        }
        getTrait(traitName) {
            if (!this.shape.traits) {
                return undefined;
            }
            const trait = Object.entries(this.shape.traits).find(([key]) => key === traitName);
            if (!trait) {
                return undefined;
            }
            return new SmithyTrait(this, trait[0], trait[1]);
        }
    }

    class SmithyStructure extends SmithyShape {
        ast;
        shapeId;
        shape;
        constructor(ast, shapeId, shape) {
            super(ast, shapeId, shape);
            this.ast = ast;
            this.shapeId = shapeId;
            this.shape = shape;
        }
        getShape() {
            return this.shape;
        }
        listMembers() {
            return Object.keys(this.shape.members);
        }
        getMembers() {
            return Object.entries(this.shape.members).map(([memberName, memberShape]) => {
                return new SmithyStructureMember(this.ast, memberName, memberShape);
            });
        }
        getMember(memberName) {
            const member = this.shape.members[memberName];
            if (!member) {
                return undefined;
            }
            return new SmithyStructureMember(this.ast, memberName, member);
        }
    }
    class SmithyStructureMember {
        ast;
        memberId;
        member;
        constructor(ast, memberId, member) {
            this.ast = ast;
            this.memberId = memberId;
            this.member = member;
        }
        getName() {
            return this.memberId;
        }
        getTarget() {
            return this.member.target;
        }
        getShape() {
            return this.ast.getShape(this.member.target);
        }
        listTraits() {
            if (!this.member.traits) {
                return [];
            }
            return Object.keys(this.member.traits);
        }
        getTraits() {
            if (!this.member.traits) {
                return [];
            }
            return Object.entries(this.member.traits).map(([traitName, traitValue]) => {
                return new SmithyTrait(this, traitName, traitValue);
            });
        }
        getTrait(traitName) {
            if (!this.member.traits) {
                return undefined;
            }
            const trait = Object.entries(this.member.traits).find(([key]) => key === traitName);
            if (!trait) {
                return undefined;
            }
            return new SmithyTrait(this, trait[0], trait[1]);
        }
    }

    class SmithyOperationInput extends SmithyStructure {
        ast;
        shapeId;
        input;
        constructor(ast, shapeId, input) {
            super(ast, shapeId, input);
            this.ast = ast;
            this.shapeId = shapeId;
            this.input = input;
        }
    }
    class SmithyOperationOutput extends SmithyStructure {
        ast;
        shapeId;
        output;
        constructor(ast, shapeId, output) {
            super(ast, shapeId, output);
            this.ast = ast;
            this.shapeId = shapeId;
            this.output = output;
        }
    }
    class SmithyOperation extends SmithyShape {
        ast;
        shapeId;
        operation;
        constructor(ast, shapeId, operation) {
            super(ast, shapeId, operation);
            this.ast = ast;
            this.shapeId = shapeId;
            this.operation = operation;
        }
        getInputTarget() {
            return this.operation.input.target;
        }
        getOutputTarget() {
            return this.operation.output.target;
        }
        getInput() {
            const inputShapeId = this.operation.input.target;
            const inputShape = this.ast.getShape(inputShapeId);
            if (inputShape === null) {
                return inputShape;
            }
            else if (!inputShape) {
                throw new Error(`Input shape not found: ${inputShapeId}`);
            }
            return new SmithyOperationInput(this.ast, inputShapeId, inputShape);
        }
        getOutput() {
            const outputShapeId = this.operation.output.target;
            const outputShape = this.ast.getShape(outputShapeId);
            if (outputShape === null) {
                return null;
            }
            else if (!outputShape) {
                throw new Error(`Input shape not found: ${outputShapeId}`);
            }
            return new SmithyOperationOutput(this.ast, outputShapeId, outputShape);
        }
    }

    class SmithyService extends SmithyShape {
        ast;
        shapeId;
        service;
        version;
        constructor(ast, shapeId, service) {
            super(ast, shapeId, service);
            this.ast = ast;
            this.shapeId = shapeId;
            this.service = service;
            this.version = service.version;
        }
        getNamespace() {
            return this.namespace;
        }
        /**
         * Get the service id
         * @deprecated Use getName() instead
         */
        getServiceId() {
            return this.name;
        }
        listOperations() {
            return this.ast.listServiceOperations(this.shapeId);
        }
        listResources() {
            //return this.ast.listServiceResources(this.shapeId)
            return []; // @todo
        }
        getOperation(operationId) {
            const operationShape = this.ast.getShape(operationId);
            if (!operationShape) {
                return null;
            }
            return new SmithyOperation(this.ast, operationId, operationShape);
        }
    }

    class SmithyAst {
        model;
        constructor(model) {
            this.model = model;
        }
        /**
         * Get the raw model
         */
        getModel() {
            return this.model;
        }
        /**
         * List all services in the model
         */
        listServices() {
            const services = [];
            for (const shapeId in this.model.shapes) {
                const shape = this.model.shapes[shapeId];
                if (shape.type === 'service') {
                    services.push(shapeId);
                }
            }
            return services;
        }
        /**
         * List all operations for a service
         * @param serviceId
         */
        listServiceOperations(serviceId) {
            const service = this.model.shapes[serviceId];
            if (!service || service.type !== 'service') {
                console.warn('Service not found', serviceId);
                return [];
            }
            const operations = [];
            for (const operationId in service.operations) {
                const operationRef = service.operations[operationId];
                // const operation = this.model.shapes[operationRef.target] as OperationShape
                // if (!operation || operation.type !== 'operation') {
                //   continue
                // }
                operations.push(operationRef.target);
            }
            return operations;
        }
        /**
         * Get a shape by ID
         * @param shapeId
         */
        getShape(shapeId) {
            if (shapeId === 'smithy.api#Unit') {
                return null;
            }
            if (!this.model.shapes[shapeId]) {
                return undefined;
            }
            return this.model.shapes[shapeId];
        }
        /**
         * Get a shape by ref
         * @param ref
         */
        getShapeByRef(ref) {
            if (!this.model.shapes[ref.target]) {
                return undefined;
            }
            return this.model.shapes[ref.target];
        }
        /**
         * Get a service by ID
         * @param serviceId
         */
        getServiceShape(serviceId) {
            const service = this.model.shapes[serviceId];
            if (!service || service.type !== 'service') {
                //throw new Error('Service not found')
                return undefined;
            }
            return service;
        }
        /**
         * Get an operation by ID
         * @param operationId
         */
        getOperationShape(operationId) {
            const operation = this.model.shapes[operationId];
            if (!operation || operation.type !== 'operation') {
                //throw new Error('Operation not found')
                return undefined;
            }
            return operation;
        }
        /**
         * Get the input shape for an operation
         * @param operation
         * @deprecated Use SmithyOperation.getInput().getShape() instead
         */
        getOperationInputShape(operation) {
            //const inputRef = operation.input
            //return this.getShape(inputRef.target) as StructureShape
            return this.getShapeByRef(operation.input);
        }
        /**
         * Get the output shape for an operation
         * @param operation
         * @deprecated Use SmithyOperation.getOutput().getShape() instead
         */
        getOperationOutputShape(operation) {
            //const outputRef = operation.output
            //return this.getShape(outputRef.target) as StructureShape
            return this.getShapeByRef(operation.input);
        }
        /**
         * Get a service instance by ID
         * @param serviceId
         */
        getService(serviceId) {
            const serviceShape = this.getServiceShape(serviceId);
            if (!serviceShape) {
                return null;
            }
            return new SmithyService(this, serviceId, serviceShape);
        }
        /**
         * Get an operation instance by ID
         * @param operationId
         */
        getOperation(operationId) {
            const operationShape = this.getShape(operationId);
            if (!operationShape) {
                return null;
            }
            return new SmithyOperation(this, operationId, operationShape);
        }
        /**
         * Create a SmithyAst from a JSON string
         * @param json
         */
        static fromJson(json) {
            return new SmithyAst(JSON.parse(json));
        }
        /**
         * Create a SmithyAst from a model
         * @param model
         */
        static fromModel(model) {
            return new SmithyAst(model);
        }
    }

    class SmithyAggregateShape extends SmithyShape {
        ast;
        shapeId;
        shape;
        constructor(ast, shapeId, shape) {
            super(ast, shapeId, shape);
            this.ast = ast;
            this.shapeId = shapeId;
            this.shape = shape;
        }
    }

    class SmithyEnum extends SmithyShape {
        ast;
        shapeId;
        shape;
        constructor(ast, shapeId, shape) {
            super(ast, shapeId, shape);
            this.ast = ast;
            this.shapeId = shapeId;
            this.shape = shape;
        }
        getMembers() {
            const enumMembers = Object.entries(this.shape.members).map(([key, value]) => {
                let enumValue = null;
                if (value?.traits && 'smithy.api#enumValue' in value.traits) {
                    enumValue = value.traits['smithy.api#enumValue'];
                }
                return {
                    [key]: enumValue,
                };
            });
            return Object.assign({}, ...enumMembers);
        }
    }

    class SmithyAstConverter {
        ast;
        constructor(ast) {
            this.ast = ast;
        }
        toSmithy() {
            // shapes
            const model = this.ast.getModel();
            const shapesSmithy = Object.keys(model.shapes)
                .filter((shapeId) => model.shapes[shapeId].type !== 'operation' &&
                model.shapes[shapeId].type !== 'service' &&
                model.shapes[shapeId].type !== 'resource')
                .map((shapeId) => {
                switch (model.shapes[shapeId].type) {
                    case 'structure':
                        return new SmithyStructure(this.ast, shapeId, model.shapes[shapeId]);
                    case 'enum':
                        return new SmithyEnum(this.ast, shapeId, model.shapes[shapeId]);
                    case 'list':
                    case 'map':
                    case 'union':
                        return new SmithyAggregateShape(this.ast, shapeId, model.shapes[shapeId]);
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
                        return new SmithyShape(this.ast, shapeId, model.shapes[shapeId]);
                    default:
                        throw new Error(`Unknown shape type: ${model.shapes[shapeId].type}`);
                }
            })
                .map((shapeInstance) => {
                return this.renderShape(shapeInstance);
            });
            const services = this.ast.listServices();
            let namespace;
            let servicesSmithy = '';
            for (const service of services) {
                const serviceInstance = new SmithyService(this.ast, service, this.ast.getShape(service));
                namespace = serviceInstance.getNamespace();
                //servicesSmithy += serviceInstance.toSmithy()
                servicesSmithy += this.renderService(serviceInstance);
            }
            return `
$version: "2"
namespace ${namespace}

${shapesSmithy.join('\n')}

${servicesSmithy}
`;
        }
        /**
         * Render a service to Smithy
         *
         * @param service
         * @protected
         */
        renderService(service) {
            // operations
            const operations = service.listOperations();
            const operationInstances = operations.map((operationId) => {
                return new SmithyOperation(this.ast, operationId, this.ast.getShape(operationId));
            });
            const operationStrings = operationInstances.map((operation) => {
                //return operation.toSmithy()
                return this.renderOperation(operation);
            });
            const operationIds = operations.map((operation) => {
                return operation.split('#')[1];
            });
            return `
service ${service.name} {
  version: "${service.version}"
  operations: [${operationIds.join(',')}]
  resources: [] // @todo
}

${operationStrings.join('\n\n')}
`;
        }
        /**
         * Render an operation to Smithy
         *
         * @param operation
         * @protected
         */
        renderOperation(operation) {
            const input = operation.getInputTarget().split('#')[1];
            const output = operation.getOutputTarget().split('#')[1];
            return `
operation ${operation.name} {
  input: ${input}
  output: ${output}
}`;
        }
        /**
         * Render a shape to Smithy
         *
         * @param shapeInstance
         * @protected
         */
        renderShape(shapeInstance) {
            if (shapeInstance instanceof SmithyEnum) {
                return this.renderEnumShape(shapeInstance);
            }
            else if (shapeInstance instanceof SmithyStructure) {
                return this.renderStructureShape(shapeInstance);
            }
            else if (shapeInstance instanceof SmithyAggregateShape) {
                return this.renderAggregateShape(shapeInstance);
            }
            else {
                return this.renderSimpleShape(shapeInstance);
            }
        }
        /**
         * Render a shape to Smithy
         *
         * @param shape
         * @protected
         */
        renderSimpleShape(shape) {
            return `
${shape.shapeType} ${shape.name}`;
        }
        renderEnumShape(shape) {
            const enumMembers = Object.entries(shape.getMembers()).map(([key, value]) => {
                return `
    ${value ? '@enumValue("' + value + '")' : ''}
    ${key}`;
            });
            return `
${shape.shapeType} ${shape.name} {
${enumMembers.join('\n')}
}`;
        }
        /**
         * Render an aggregate shape to Smithy
         *
         * @param shape
         * @protected
         */
        renderAggregateShape(shape) {
            // list
            if (shape.shapeType === 'list') {
                const _shape = shape.getShape();
                const member = _shape.member.target.split('#')[1];
                return `
${shape.shapeType} ${shape.name} {
  member: ${member}
}`;
            }
            // map
            if (shape.shapeType === 'map') {
                const _shape = shape.getShape();
                const key = _shape.key.target.split('#')[1];
                const value = _shape.value.target.split('#')[1];
                return `
${shape.shapeType} ${shape.name} {
  key: ${key}
  value: ${value}
}`;
            }
            // union
            if (shape.shapeType === 'union') {
                const _shape = shape.getShape();
                const membersStr = Object.entries(_shape.members).map(([key, value]) => {
                    const member = value.target.split('#')[1];
                    return `  ${key}: ${member}`;
                });
                return `
${shape.shapeType} ${shape.name} {
${membersStr.join('\n')}
}`;
            }
            return `
//@todo UNSUPPORTED TYPE ${shape.shapeType} ${shape.name} {}`;
        }
        /**
         * Render a structure shape to Smithy
         *
         * @param shape
         * @protected
         */
        renderStructureShape(shape) {
            return `
structure ${shape.name} {
  // @todo add structure members
}`;
        }
    }

    exports.SmithyAggregateShape = SmithyAggregateShape;
    exports.SmithyAst = SmithyAst;
    exports.SmithyAstConverter = SmithyAstConverter;
    exports.SmithyEnum = SmithyEnum;
    exports.SmithyOperation = SmithyOperation;
    exports.SmithyService = SmithyService;
    exports.SmithyShape = SmithyShape;
    exports.SmithyStructure = SmithyStructure;
    exports.SmithyStructureMember = SmithyStructureMember;
    exports.SmithyTrait = SmithyTrait;
    exports.getDistinctShapeTypes = getDistinctShapeTypes;
    exports.parseModel = parseModel;
    exports.parseService = parseService;
    exports.parseServiceOperations = parseServiceOperations;
    exports.parseServices = parseServices;
    exports.parseTraits = parseTraits;

}));
