const PrismaScalarTypes = [
  "String",
  "Boolean",
  "Int",
  "BigInt",
  "Float",
  "Decimal",
  "DateTime",
  "Json",
  "Bytes",
  "Unsupported",
];

const PrismaAttributes = [
  "@id",
  "@@id",
  "@default",
  "@unique",
  "@@unique",
  "@@index",
  "@relation",
  "@map",
  "@@map",
  "@updatedAt",
  "@ignore",
  "@@ignore",
  "@@schema",
];

const PrismaAttributeFunctions = [
  "auto()",
  "autoincrement()",
  "sequence()",
  "cuid()",
  "uuid()",
  "now()",
  "dbgenerated()",
];
