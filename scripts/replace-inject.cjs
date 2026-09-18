const fs = require('fs')
const path = require('path')

const BASE = __dirname

// Read from grep output
const allFiles = [
  'src/components/about.vue',
  'src/components/admin/commentList.vue',
  'src/components/admin/resourceList.vue',
  'src/components/admin/sortList.vue',
  'src/components/admin/treeHoleList.vue',
  'src/components/admin/userList.vue',
  'src/components/admin/verify.vue',
  'src/components/admin/webEdit.vue',
  'src/components/article.vue',
  'src/components/articleList.vue',
  'src/components/auth/LoginForm.vue',
  'src/components/auth/RegisterForm.vue',
  'src/components/auth/ResetPwdForm.vue',
  'src/components/auth/UnPwdLogin.vue',
  'src/components/AuthModal.vue',
  'src/components/collect.vue',
  'src/components/comment/comment.vue',
  'src/components/comment/commentBox.vue',
  'src/components/comment/graffiti.vue',
  'src/components/common/card.vue',
  'src/components/common/emoji.vue',
  'src/components/common/photo.vue',
  'src/components/common/process.vue',
  'src/components/common/sortArticle.vue',
  'src/components/common/treeHole.vue',
  'src/components/common/twoPoem.vue',
  'src/components/common/twoPoem1.vue',
  'src/components/common/uploadPicture.vue',
  'src/components/favorite.vue',
  'src/components/friend.vue',
  'src/components/funny.vue',
  'src/components/home.vue',
  'src/components/index.vue',
  'src/components/love.vue',
  'src/components/message.vue',
  'src/components/myAside.vue',
  'src/components/Danmaku.vue',
  'src/components/sort.vue',
  'src/components/travel.vue',
  'src/components/user.vue',
  'src/components/weiYan.vue',
  'src/components/weiYan1.vue',
]

let updatedCount = 0
let noChangeCount = 0

allFiles.forEach(function(filePath) {
  const fullPath = path.join(BASE, filePath)
  if (!fs.existsSync(fullPath)) {
    console.log('MISSING: ' + filePath)
    return
  }

  var content = fs.readFileSync(fullPath, 'utf-8')
  var changed = false

  // Replace inject('$common') with useCommon()
  // Pattern with type annotation + !
  content = content.replace(/const\s+\$common\s*:\s*\w+\s*=\s*inject\s*\(\s*['"]\$common['"]\s*\)\s*!/g, function(m) { return 'const $common = useCommon()' })
  if (content.indexOf('const $common = useCommon()') > -1 && changed === false) {}
  content = content.replace(/const\s+\$common\s*=\s*inject\s*\(\s*['"]\$common['"]\s*\)\s*!/g, function(m) { return 'const $common = useCommon()' })
  content = content.replace(/const\s+\$common\s*:\s*\w+\s*=\s*inject\s*\(\s*['"]\$common['"]\s*\)/g, function(m) { return 'const $common = useCommon()' })
  content = content.replace(/const\s+\$common\s*=\s*inject\s*\(\s*['"]\$common['"]\s*\)/g, function(m) { return 'const $common = useCommon()' })

  // Replace inject('$constant') with useConstant()
  content = content.replace(/const\s+\$constant\s*:\s*\w+\s*=\s*inject\s*\(\s*['"]\$constant['"]\s*\)\s*!/g, function(m) { return 'const $constant = useConstant()' })
  content = content.replace(/const\s+\$constant\s*=\s*inject\s*\(\s*['"]\$constant['"]\s*\)\s*!/g, function(m) { return 'const $constant = useConstant()' })
  content = content.replace(/const\s+\$constant\s*:\s*\w+\s*=\s*inject\s*\(\s*['"]\$constant['"]\s*\)/g, function(m) { return 'const $constant = useConstant()' })
  content = content.replace(/const\s+\$constant\s*=\s*inject\s*\(\s*['"]\$constant['"]\s*\)/g, function(m) { return 'const $constant = useConstant()' })

  // Remove 'inject' from Vue imports, add useCommon/useConstant
  content = content.replace(/import\s*\{([^}]*)\s*inject\s*([^}]*)\}\s*from\s*['"]vue['"]/g, function(match, before, after) {
    var imports = (before + after).split(',').map(function(s) { return s.trim() }).filter(function(s) { return s && s !== 'inject' })
    var hasUC = imports.some(function(i) { return i.indexOf('useCommon') > -1 })
    var hasUU = imports.some(function(i) { return i.indexOf('useConstant') > -1 })
    if (!hasUC) imports.push('useCommon')
    if (!hasUU) imports.push('useConstant')
    // dedupe
    imports = imports.filter(function(item, pos) { return imports.indexOf(item) === pos })
    if (imports.length === 0) return ''
    return 'import {' + imports.join(', ') + '} from \'vue\''
  })

  var newContent = content
  if (newContent !== fs.readFileSync(fullPath, 'utf-8')) {
    fs.writeFileSync(fullPath, newContent, 'utf-8')
    updatedCount++
    console.log('Updated: ' + filePath)
  } else {
    noChangeCount++
  }
})

console.log('Done. Updated: ' + updatedCount + ', No change: ' + noChangeCount)
