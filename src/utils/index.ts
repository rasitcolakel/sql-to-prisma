import { PostgreSQLScalarTypesToPrisma } from "./postgresql";

interface ITable {
  name: string;
  columns: IColumn[];
}

interface IColumn {
  name: string;
  type: string;
  required: boolean;
  rawType: string;
}

export class SqlToTypeScript {
  private sql: string = "";
  private tables: ITable[] = [];
  private columns: IColumn[] = [];
  private static instance: SqlToTypeScript;

  static getInstance(): SqlToTypeScript {
    if (!SqlToTypeScript.instance) {
      SqlToTypeScript.instance = new SqlToTypeScript();
    }
    return SqlToTypeScript.instance;
  }

  setSql(sql: string): void {
    this.sql = sql;
  }

  getSql(): string {
    return this.sql;
  }

  setTables(tables: ITable[]): void {
    console.log("setTables", tables);
    this.tables = tables;
  }

  getTables(): ITable[] {
    return this.tables;
  }

  findTableAndColumnNames() {
    const tables: ITable[] = [];
    const lines = this.sql.split("\n").map((line) => line.trim());

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("CREATE TABLE")) {
        const table: ITable = { name: "", columns: [] };
        const tableName = lines[i].split(" ")[2];
        table.name = tableName;
        i += 1;
        while (!lines[i].startsWith(");") || !lines[i].startsWith(")")) {
          // TODO: omit primary key, we will add it later
          if (lines[i].includes("PRIMARY KEY")) {
            this.handlePrimaryKey(table, lines[i]);
            i++;
            continue;
          }

          const column: IColumn = {
            name: "",
            type: "",
            rawType: "",
            required: false,
          };
          const columnLine = lines[i].split(" ");
          column.name = columnLine[0];
          column.type = this.typeToPrismaType(columnLine[1]);
          column.rawType = columnLine[1];
          column.required = lines[i].includes("NOT NULL") ? true : false;
          table.columns.push(column);
          i++;
        }
        tables.push(table);
      }
    }
    this.setTables(tables);
  }

  typeToPrismaType(type: string): string {
    const prismaType = type
      .split("(")[0]
      .replace(/[^\p{L}]/gu, "")
      .toLowerCase() as keyof typeof PostgreSQLScalarTypesToPrisma;
    return PostgreSQLScalarTypesToPrisma[prismaType] || "Unsupported";
  }

  handlePrimaryKey(table: ITable, line: string) {
    const primaryKey = line.split("(")[1].replace(")", "");
    const column = table.columns.find((column) => column.name === primaryKey);
    if (column) {
      column.type += " @id";
    }

    console.log("handlePrimaryKey", primaryKey, column);
    return table;
  }

  sqlToPrisma(): string {
    const prismaModels: string[] = [];

    this.tables.forEach((table) => {
      const prismaModel: string[] = [];
      prismaModel.push(`model ${table.name} {`);
      table.columns.forEach((column) => {
        prismaModel.push(
          `  ${column.name} ${column.type}${column.required ? "" : "?"}`
        );
      });
      prismaModel.push("}");
      prismaModels.push(prismaModel.join("\n"));
    });

    return prismaModels.join("\n\n");
  }
}
