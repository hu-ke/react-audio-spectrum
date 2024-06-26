export const getRandomId = (len: number) => {
  let str = '1234567890-qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
  let strLen = str.length
  let res = ''
  for (let i = 0; i < len; i++) {
      let randomIndex = Math.floor((Math.random() * strLen))
      res += str[randomIndex]
  }
  return res
}