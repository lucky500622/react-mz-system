export const turnRoleToChinese = (role: string) => {
  if (role === 'sup_admin') {
    return '超级管理员'
  }
  if (role === 'com_admin') {
    return '仓库管理员'
  }
  else {
    return '上架管理员'
  }
}

export const getInitial = (nameStr: string) => {
  const firstChar = nameStr?.trim().charAt(0) || ''
  if (/[a-zA-Z]/.test(firstChar)) {
    return firstChar.toUpperCase()
  }
  else {
    return firstChar
  }
}