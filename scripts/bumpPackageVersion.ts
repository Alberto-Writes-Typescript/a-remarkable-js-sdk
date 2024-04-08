import { execSync } from 'child_process'
import * as fs from 'fs'
import open from 'open'
// @ts-expect-error - Expected error
import path from 'path'
import { inc } from 'semver'
import { spinner, intro, outro, confirm, cancel, select } from '@clack/prompts'

class PackageJsonManager {
  private readonly path: string
  private readonly payload: Record<string, unknown>

  constructor () {
    this.path = path.resolve(process.cwd(), 'package.json')
    this.payload = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
  }

  get version (): string {
    return this.payload.version as string
  }

  set version (newVersion: string) {
    this.payload.version = newVersion
    this.save()
  }

  private save (): void {
    fs.writeFileSync(this.path, JSON.stringify(this.payload, null, 2))
  }
}

class ChangelogManager {
  private readonly path: string

  constructor () {
    this.path = path.resolve(process.cwd(), 'CHANGELOG.md')
  }

  get content (): string {
    return fs.readFileSync(this.path, 'utf-8')
  }

  set content (newContent: string) {
    fs.writeFileSync(this.path, newContent)
  }

  bump (newVersion: string): void {
    this.addNewVersionSection(newVersion)
    this.updateTagComparisonLinks(newVersion)
  }

  changelog (version: string): string {
    const lines = this.content.split('\n')
    const start = lines.findIndex(line => line.includes(`## [${version}]`))
    const end = lines.slice(start + 2).findIndex(line => line.trim() === '') + start + 2
    return lines.slice(start, end).join('\n')
  }

  private addNewVersionSection (newVersion: string): void {
    const lines = this.content.split('\n')
    const unreleasedIndex = lines.findIndex(line => line.includes('## [Unreleased]'))

    const currentDate = new Date().toISOString().split('T')[0]
    const newVersionLine = `\n## [${newVersion}] - ${currentDate}`
    lines.splice(unreleasedIndex + 1, 0, newVersionLine)

    this.content = lines.join('\n')
  }

  private updateTagComparisonLinks (newVersion: string): void {
    const lines = this.content.split('\n')
    const unreleasedLinkIndex = lines.findIndex(line => line.startsWith('[unreleased]:'))

    const previousVersionLine = lines.slice(unreleasedLinkIndex + 1)[0]
    const previousVersion = previousVersionLine.slice(1, previousVersionLine.indexOf(']:'))
    lines[unreleasedLinkIndex] = `[unreleased]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v${newVersion}...HEAD`

    // Add the new version link
    const newVersionLink = `[${newVersion}]: https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/compare/v${previousVersion}...v${newVersion}`
    lines.splice(unreleasedLinkIndex + 1, 0, newVersionLink)

    this.content = lines.join('\n')
  }
}

/**
 * SCRIPT BODY
 */
void (async () => {
  intro('Release a newer package version')

  const packageJsonManager = new PackageJsonManager()
  const changelogManager = new ChangelogManager()

  const releaseKind = await select({
    message: 'Which kind of version do you want to release?',
    options: [
      { value: 'major', label: 'MAJOR', hint: 'when you make incompatible API changes' },
      { value: 'minor', label: 'MINOR', hint: 'when you add functionality in a backward compatible manner' },
      { value: 'patch', label: 'PATCH', hint: 'when you make backward compatible bug fixes' }
    ]
  })

  const newVersion = inc(packageJsonManager.version, releaseKind as 'major' | 'minor' | 'patch')

  const bumpConfirmation = await confirm({
    message: `Bumping package version to ${newVersion}. Do you want to continue?`
  })

  if (!bumpConfirmation) {
    cancel('Operation cancelled...')
    process.exit(0)
  }

  const s = spinner()

  s.start('Updating package.json')
  packageJsonManager.version = newVersion
  s.stop('package.json updated!')

  s.start('Updating CHANGELOG.md')
  changelogManager.bump(newVersion)
  s.stop('CHANGELOG.md updated!')

  s.start('Pushing changes to git')
  execSync('git add package.json CHANGELOG.md')
  execSync(`git commit -m "bump to v${newVersion}"`)
  execSync('git push')
  s.stop('Changes pushed to git!')

  outro(`
    Everything up to date!
    
    To trigger the release process:
    1. Rebase commit to main branch (if not rebased already).
    2. Create new release (you can find the pre-filled release form automatically opened in your web browser).
  `)

  await open(`https://github.com/Alberto-Writes-Typescript/a-remarkable-js-sdk/releases/new?tag=v${newVersion}&title=v${newVersion}&body=${encodeURIComponent(changelogManager.changelog(newVersion))}`)
})()
