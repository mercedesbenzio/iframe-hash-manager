import F from './fp'
import logic from './logic'


export default id => iframes => () => {
  console.log('generating hash', id, iframes)

  const encodeIframeRoute = iframe => `_${id(iframe.el)}.${logic.unwrapHash(iframe.el.contentWindow.location.hash) || ''}_,`

  const generateHashFromMultiple = F.compose([
    F.map( encodeIframeRoute ),
    F.join(''),
    (str => `#multi/${str}`)
  ])

  if (iframes.length === 1) {
    return iframes[0].el.contentWindow.location.hash
  } else if (iframes.length > 1) {
    return generateHashFromMultiple(iframes)
  } else {
    return undefined
  }
}
