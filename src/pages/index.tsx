import Image from "next/image";
import { Inter } from "next/font/google";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useCallback, useEffect, useState } from "react";
import { StreamLanguage } from "@codemirror/language";
import { sql, MySQL } from "@codemirror/lang-sql";
import { SqlToTypeScript } from "@/utils";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const sqlToTs = new SqlToTypeScript();

  const onChange = useCallback((value: any, viewUpdate: any) => {
    setValue(value);
    sqlToTs.setSql(value);
    sqlToTs.findTableAndColumnNames();
    setPrisma(sqlToTs.sqlToPrisma());
  }, []);

  const [value, setValue] = useState(`CREATE TABLE users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);



const [prisma,setPrisma] = useState<string>();

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between${inter.className} grid grid-cols-2`}
    >
      <CodeMirror
        className="h-screen"
        value={value}
        theme="dark"
        onChange={onChange}
        extensions={[sql({})]}
        style={{ fontSize: "1.2rem"  }}

      />
      <CodeMirror
        className="h-screen"
        value={prisma}
        theme="dark"
        extensions={[sql({})]}
        style={{ fontSize: "1.2rem"  }}
      />
    </main>
  );
}
