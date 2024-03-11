import { Model, AbstractModelShape, ServiceShape } from './types.js'

export const parseModel = (model: Model) => {
  console.log(Object.keys(model))
  console.log('Smithy version:', model.smithy)
  for (const shapeId in model.shapes) {
    const shape = model.shapes[shapeId]
    console.log(`found shape [${shape.type}] with ID ${shapeId}`)
    //console.log(shape)
  }
}

export const getDistinctShapeTypes = (model: Model) => {
  const types = new Set<string>()
  for (const shapeId in model.shapes) {
    const shape = model.shapes[shapeId]
    if (types.has(shape.type)) {
      continue
    }
    types.add(shape.type)
  }
  return Array.from(types.values())
}

export const parseServices = (model: Model) => {
  const services: Record<string, ServiceShape> = {}
  for (const shapeId in model.shapes) {
    const shape = model.shapes[shapeId]
    if (shape.type === 'service') {
      const service = shape as ServiceShape
      services[shapeId] = service
      console.log('found service:', shapeId, service.version)
      parseService(service)
    }
  }
  return services
}

export const parseTraits = (shape: AbstractModelShape) => {
  if (shape.traits) {
    console.log('traits:', shape.traits)
    for (const trait in shape.traits) {
      console.log(`> found trait [${trait}]`)
    }
  }
}

export const parseService = (service: ServiceShape) => {
  console.log(service)
  parseTraits(service)
  parseServiceOperations(service)
}

export const parseServiceOperations = (service: ServiceShape) => {
  for (const operationIdx in service.operations) {
    const operationRef = service.operations[operationIdx]
    console.log('found operation:', operationRef.target)
    //parseOperation(operation)
  }
}
