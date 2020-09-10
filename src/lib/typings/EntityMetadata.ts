export interface EntityMetadata {
  idProperty: string | symbol;
  properties: { identifier: string | symbol; type: string }[];
}
