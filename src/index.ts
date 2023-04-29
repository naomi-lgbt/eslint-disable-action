import { readdir, stat, readFile } from "fs/promises";
import { join } from "path";

import { getInput, setFailed } from "@actions/core";

const getFiles = async (path: string): Promise<string[]> => {
  const fileNames: string[] = [];
  const list = await readdir(path);
  for (const file of list) {
    const status = await stat(join(path, file));
    if (status.isDirectory()) {
      const files = await getFiles(join(path, file));
      fileNames.push(...files);
    } else {
      fileNames.push(join(path, file));
    }
  }
  return fileNames;
};

(async () => {
  try {
    const rawInput = getInput("directories", { required: true });
    console.log(
      `::notice::Checking ${rawInput} directories for disable directives.`
    );
    const array = rawInput.split(/\s+/g);
    let failed = false;

    for (const path of array) {
      const fileNames = await getFiles(join(process.cwd(), path));
      for (const file of fileNames) {
        const text = await readFile(file, "utf8");
        if (/eslint-disable/.test(text)) {
          const lines = text.split(/\r?\n/g);
          const matchedLines = lines.filter((line) =>
            /eslint-disable/.test(line)
          );
          const fileName = file.replace(process.cwd() + "/", "");
          failed = true;
          for (const line of matchedLines) {
            const lineNumber = lines.indexOf(line) + 1;
            console.error(
              `::error file=${fileName},line=${lineNumber}::Found a disable directive at ${file}:${lineNumber}`
            );
          }
        }
      }
    }

    if (failed) {
      setFailed(`::error::One or more files contain a disable directive.`);
      return;
    }

    console.log("::notice::No disable directives found.");
  } catch (err) {
    setFailed(err as Error);
  }
})();
