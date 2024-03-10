export type SmithyModel = {
  smithy?: string
  metadaata?: any
  shapes: {
    [key: string]: ModelShape
  }
  operations?: any
}

export type ShapeTypes =
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

export type ModelShape = {
  type: ShapeTypes
  traits?: Record<string, any>
}

export type ShapeReference = {
  target: string
}

export type Member = ShapeReference & {
  traits?: Record<string, any>
}

export type ListShape = ModelShape & {
  type: 'list'
  member: ShapeReference
}

export type MapShape = ModelShape & {
  type: 'map'
  key: ShapeReference
  value: ShapeReference
}

export type UnionShape = ModelShape & {
  type: 'union'
  members: Record<string, Member>
}

export type EnumShape = ModelShape & {
  type: 'enum'
  members: Record<string, Member>
}

export type StructureShape = ModelShape & {
  type: 'structure'
  required?: string[]
  members: Record<string, Member>
}

export type ServiceShape = ModelShape & {
  type: 'service'
  version: string
  operations: Record<string, ShapeReference> // Binds a list of operations to the service. Each reference MUST target an operation.
  resources: Record<string, ShapeReference> // Binds a set of resource shapes to the service. Each element in the given list MUST be a valid shape ID that targets a resource shape.
  errors?: Record<string, ShapeReference> // Defines a list of common errors that every operation bound within the closure of the service can return. Each provided shape ID MUST target a structure shape that is marked with the error trait.
  //@todo rename?: any
}

export type OperationShape = ModelShape & {
  type: 'operation'
  input: ShapeReference // Binds an input shape to the operation. The reference MUST target a structure shape.
  output: ShapeReference // Binds an output shape to the operation. The reference MUST target a structure shape.
  errors?: Record<string, ShapeReference>
}

export type ResourceShape = ModelShape & {
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
