import { type SchemaTypeDefinition } from 'sanity'
import TSE from './create-tse'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [TSE],
}
