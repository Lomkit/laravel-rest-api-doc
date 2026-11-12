/**
 * Opens llms-full.txt with the package, its version and its requirements, so
 * that a reader of the file alone knows which version the pages describe.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('llms:generate:full', (_event, options, contents) => {
    contents.unshift([
      `# ${packageInfo.name} ${latestDocsVersion.name}: full documentation`,
      `> ${packageInfo.description}`,
      [
        `This file holds every page of ${packageInfo.name} ${latestDocsVersion.name}, the current version (latest release ${packageInfo.release}).`,
        `It requires PHP ${packageInfo.php}+ and Laravel ${packageInfo.laravel}+ and installs with \`composer require ${packageInfo.composerName}\`.`,
        `The 2.x documentation is not part of this file: ${options.domain}/2.x/getting-started/installation.`
      ].join(' ')
    ].join('\n\n'))
  })
})
