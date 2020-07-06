const fs = require('fs')
const {exec} = require('child_process')

/***********************
 * CONSOLE TEXT COLORS *
 ***********************/
const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const RESET = "\x1b[0m"

/********
 * DATA *
 ********/
const SED = 'sed.json'
const INSTALL = 'install.json'

/****************
 * CONSOLE TEXT *
 ****************/
const ERROR = '[ERROR]'
const OK = '[OK]'
const NOT_FOUND_ERROR = 'not found'
const INVALID_JSON_FORMAT_ERROR = 'invalid json format'

const TEMPLATE = '.template'
const COMMENTS = ['\/\/', '#', '']


const sed = readJSON(SED)
const install = readJSON(INSTALL)
if (install.hasOwnProperty('create'))
    create(install.create)
if (install.hasOwnProperty('templates'))
    copyTemplate(install.templates, sed)

/**
 * @param message {string} Example:
 *     'Need sed.json'
 */
function error(message) {
    console.error(`${RED}${ERROR} ${message}${RESET}`)
    process.exit(1)
}

/**
 * @param message {string} Example:
 *     'All good'
 */
function info(message) {
    console.log(`${GREEN}${OK}${RESET} ${message}`)
}

/**
 * @param filePath {string} Example:
 *     'install.json'
 * @return {Object}
 */
function readJSON(filePath) {
    if (!fs.existsSync(filePath))
        error(`${filePath} ${NOT_FOUND_ERROR}`)
    try {
        const data = fs.readFileSync(filePath)
        return JSON.parse(data.toString())
    } catch (e) {
        error(`${filePath} ${INVALID_JSON_FORMAT_ERROR}`)
    }
}

/**
 * @param directories {Object} Example:
 *     {
 *         "data": 775,
 *         "log": 775
 *     }
 */
function create(directories) {
    for (const [directory, permissions] of Object.entries(directories))
        createOne(directory, permissions)
}

/**
 * @param directory {string} Example:
 *     'log'
 * @param permissions {number} Example:
 *     775
 */
function createOne(directory, permissions) {
    if (!fs.existsSync(directory))
        fs.mkdirSync(directory)
    const mask = getMask(permissions)
    fs.chmodSync(directory, mask)
    info(`${directory}:${permissions}`)
}

/**
 * @param permission {number} Example:
 *     775
 * @return {number} Example:
 *     493
 */
function getMask(permission) {
    return parseInt(permission.toString(), 8)
}

/**
 * @param templates {string[]} Example:
 *     [
 *         'docker-compose.template.yml',
 *         'config/traefik/traefik.template.yml'
 *     ]
 * @param sed {Object} Example:
 *     {
 *         domain: 'traefik.localhost',
 *         email: 'email@domain.com'
 *     }
 */
function copyTemplate(templates, sed) {
    for (let i = 0; i < templates.length; i++) {
        const template = templates[i]
        const filePath = template.replace(TEMPLATE, '')
        fs.copyFileSync(template, filePath)
        replaceTemplateText(filePath, sed)
        info(`${filePath}`)
    }
}

/**
 * Search construction like:
 *     '{sed.value}'
 *     '#{sed.value}#'
 *     '//{sed.value}//'
 * And replace to params from sed object
 * @param filePath {string} Example:
 *      'docker-compose.template.yml'
 * @param sed {Object} Example:
 *     {
 *         domain: 'traefik.localhost',
 *         email: 'email@domain.com'
 *     }
 */
function replaceTemplateText(filePath, sed) {
    for (const [key, value] of Object.entries(sed)) {
        for (let i = 0; i < COMMENTS.length; i++) {
            const comment = COMMENTS[i]
            const searchString = `${comment}{sed.${key}}`
            const command = `sed -i 's/${searchString}/${value}/' ${filePath}`
            exec(command)
        }
    }
}