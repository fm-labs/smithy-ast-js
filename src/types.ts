export type SmithyVersion = '1.0' | '2.0' | string

export type ModelShapeTypes =
  | 'structure'
  | 'service'
  | 'operation'
  | 'resource'
  | 'enum'
  | 'string'
  | 'list'
  | 'union'
  | 'map'
  | 'blob'
  | 'boolean'
  | 'timestamp'
  | 'document'
  | 'integer'
  | 'byte'
  | 'short'
  | 'float'
  | 'double'
  | 'long'
  | 'bigDecimal'
  | 'bigInteger'

// Node values are JSON-like values used to define metadata and the value of an applied trait.
export type NodeValue = number | string | boolean
export type NodeValueType = NodeValue | NodeValue[] | Record<string, NodeValue>

export type ModelMetadata = {
  [key: string]: NodeValueType
}

// export type ModelTraits = {
//   [key: string]: NodeValueType
// }
//
// export type ModelTraitRecords = Record<string, NodeValueType>

export type Model = {
  metadaata?: ModelMetadata
  smithy: SmithyVersion
  shapes: {
    [key: string]: AbstractModelShape
  }
}

export type AbstractModelShape = {
  type: ModelShapeTypes
  traits?: Record<string, NodeValueType>
}

export type ShapeReference = {
  target: string
}

export type ShapeMember = ShapeReference & {
  traits?: Record<string, NodeValueType>
}

export type ListShape = AbstractModelShape & {
  type: 'list'
  member: ShapeReference
}

export type MapShape = AbstractModelShape & {
  type: 'map'
  key: ShapeReference
  value: ShapeReference
}

export type UnionShape = AbstractModelShape & {
  type: 'union'
  members: Record<string, ShapeMember>
}

export type EnumShape = AbstractModelShape & {
  type: 'enum'
  members: Record<string, ShapeMember>
}

export type StructureShape = AbstractModelShape & {
  type: 'structure'
  required?: string[]
  members: Record<string, ShapeMember>
}

export type ServiceShape = AbstractModelShape & {
  type: 'service'
  version: string
  operations: Record<string, ShapeReference> // Binds a list of operations to the service. Each reference MUST target an operation.
  resources: Record<string, ShapeReference> // Binds a set of resource shapes to the service. Each element in the given list MUST be a valid shape ID that targets a resource shape.
  errors?: Record<string, ShapeReference> // Defines a list of common errors that every operation bound within the closure of the service can return. Each provided shape ID MUST target a structure shape that is marked with the error trait.
  //@todo rename?: any
}

export type OperationShape = AbstractModelShape & {
  type: 'operation'
  input: ShapeReference // Binds an input shape to the operation. The reference MUST target a structure shape.
  output: ShapeReference // Binds an output shape to the operation. The reference MUST target a structure shape.
  errors?: Record<string, ShapeReference>
}

export type ResourceShape = AbstractModelShape & {
  type: 'resource'
  identifiers: Record<string, ShapeReference> // Defines identifier names and shape IDs used to identify the resource.
  properties: Record<string, ShapeReference> // Defines a map of property string names to shape IDs that enumerate the properties of the resource.
  create?: ShapeReference
  read?: ShapeReference
  update?: ShapeReference
  delete?: ShapeReference
  list?: ShapeReference
  put?: ShapeReference
  operations?: ShapeReference[]
  collectionOperations?: ShapeReference[]
}
