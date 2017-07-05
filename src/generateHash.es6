import F from './fp'
import logic from './logic'


// generateHash :: (iframe -> String) -> [iframe] -> String
export default id => iframes => {

  const encodeIframeRoute = iframe => `_${id(iframe)}.${logic.unwrapHash(iframe.contentWindow.location.hash) || ''}_,`

  const generateHashFromMultiple = F.compose([
    F.map( encodeIframeRoute ),
    F.join(''),
    (str => `#multi/${str}`)
  ])

  if (iframes.length === 1) {
    return iframes[0].contentWindow.location.hash
  } else if (iframes.length > 1) {
    return generateHashFromMultiple(iframes)
  } else {
    return undefined
  }
}
