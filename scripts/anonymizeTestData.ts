import * as fs from 'fs'
import path from 'path'

const TEST_DIRECTORY = './test'

async function getHarFilePaths (folder: string = TEST_DIRECTORY): Promise<string[]> {
  // Array to hold the .har files
  let harFiles = []

  // Read all the files and directories in the directory
  const folderEntries = fs.readdirSync(folder, { withFileTypes: true })

  for (const entry of folderEntries) {
    const entryPath = path.join(folder, entry.name)

    if (entry.isDirectory()) {
      harFiles = harFiles.concat(await getHarFilePaths(entryPath))
    } else {
      if (path.extname(entry.name) === '.har') harFiles.push(entryPath)
    }
  }

  return harFiles
}

function anonymizeHarFile (harFilePath: string): void {
  const data = fs.readFileSync(harFilePath, 'utf8')
  const anonymizedData = data.replace(/(\\"visibleName\\":\\")(.*?)\\"/g, '$1DocumentOrFolder\\"')
  fs.writeFileSync(harFilePath, anonymizedData, 'utf8')
}

await (async () => {
  const harFilePaths = await getHarFilePaths()
  harFilePaths.forEach((harFilePath) => { anonymizeHarFile(harFilePath) })
})()
