export const turnRoleToChinese = (role: string) => {
  if (role === 'superadmin') {
    return '超级管理员'
  }
  if (role === 'admin') {
    return '管理员'
  }
  else {
    return '普通成员'
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