import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const sourceRoot = fileURLToPath(new URL('../src/', import.meta.url))

function parts(filename) {
  return path.relative(sourceRoot, filename).split(path.sep)
}

export default {
  rules: {
    'module-boundaries': {
      meta: {
        type: 'problem',
        schema: [],
        messages: { invalid: "Import '{{importPath}}' violates ownership: {{reason}}." },
      },
      create(context) {
        const from = parts(context.filename)
        function check(source) {
          const importPath = source?.value
          if (typeof importPath !== 'string') return
          let target
          if (importPath.startsWith('@/')) target = path.resolve(sourceRoot, importPath.slice(2))
          else if (importPath.startsWith('.')) target = path.resolve(path.dirname(context.filename), importPath)
          else return
          if (!target.startsWith(sourceRoot)) return
          const to = parts(target)
          let reason
          if (from[0] === 'shared' && ['app', 'modules'].includes(to[0])) {
            reason = 'shared code cannot depend on app or feature modules'
          } else if (from[0] === 'modules' && (to[0] === 'app' || (to[0] === 'modules' && from[1] !== to[1]))) {
            reason = 'feature modules cannot depend on app or other features'
          } else if (from[0] === 'app' && to[0] === 'modules' && !(to.length === 2 || (to.length === 3 && /^index(?:\.[jt]sx?)?$/.test(to[2])))) {
            reason = 'app must use the feature public index entry'
          }
          if (reason) context.report({ node: source, messageId: 'invalid', data: { importPath, reason } })
        }
        return {
          ImportDeclaration: (node) => check(node.source),
          ExportNamedDeclaration: (node) => check(node.source),
          ExportAllDeclaration: (node) => check(node.source),
          ImportExpression: (node) => check(node.source),
        }
      },
    },
  },
}
