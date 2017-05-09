// iframeHashManager
// This module can be transpiled to ES5 and included as-is without any additional initialization code
// to manage the hashes in the Onweb multiple-spa iframe concept.
// It currently supports
// - extracting the initial state of the apps from the URL and injecting it into the iframes
//   if no hash was found in the master URL, an initial URL will be generated based on the iframes on the site
// - keeping the hash of the master window up-to-date with the hashes of individual iframes

// Note on the bootstrap logic
// Because the event listeners get detached on load, a special procedure is required
// 1. wait for all the iframes to load
// 2. re-attach the event listeners for hash change onto the iframe

import F from './fp'
import logic from './logic.js'

// URL format
export default function bootstrap (window, selector) {

  function init (iframeCount) {

    // getElements :: String -> Array HTMLElement
    const getElements  = window.document.querySelectorAll.bind(window.document)

    // toArray :: NodeList HTMLElement -> Array HTMLElement
    const toArray = Array.from.bind(Array)

    // getIframesBySelector :: String -> getIframes
    // Returns a function that collects all iframes that also match the given selector.
    // Note: Maybe this could be improved by combining the 'iframe' part to the given selector string.
    // We could then omit F.filter from the source code (maybe)
    const getIframesBySelector = (window, selector) => () => F.compose([
      getElements,
      toArray,
      F.filter(x => x.tagName === "IFRAME")
    ])(selector || 'iframe')

    // getIframes :: Void -> Array iframe
    const getIframes = getIframesBySelector(window, selector)

    // handleSlaveHashChangeFor :: HTMLIFrameElement -> Event hashchange -> Effect window.location
    const handleSlaveHashChangeFor = iframe => ev => {
      const hash = logic.unwrapHash(ev.newURL)
      const appId = iframe.id

      writeToLocation(logic.injectIntoMaster(appId, hash, window.location.hash))
    }

    // writeToLocation :: String -> Effect window.location
    function writeToLocation (hash) {
        history.pushState({}, document.title || "Mercedes Benz", hash);
    };

    // bindRouting :: iframe -> Int -> Effect iframe
    function bindRouting (iframe, index) {
      iframe.addEventListener('load', function () {
        attachListenerToiframe(index, 'hashchange', handleSlaveHashChangeFor(iframe))
      })
      return iframe
    }

    // attachListenerToiframe :: iframe -> Int -> Effect iframe
    function attachListenerToiframe (iframeIndex, eventId, handler) {
      getIframes()[iframeIndex].contentWindow.addEventListener(eventId, handler)
    }

    // iframes :: Array iframe
    const iframes = getIframes()

    // setDefaultHash :: Array iframe -> Effect window.location
    const setDefaultHashFrom = F.compose([
      F.map(createSingleSlaveSkeleton),
      F.join(''),
      logic.wrap,
      writeToLocation
    ])

    // extractHashesFor :: Array iframes -> String -> Array String
    const extractHashesFor = masterHash => iframes => {
      var ids = F.map(iframe => iframe.id)(iframes)
      return F.map(id => logic.extractFromMaster(id, masterHash))(ids)
    }

    // setHashFor :: iframe -> String -> Effect iframe
    const setHashFor = iframe => hash => { iframe.contentWindow.location.hash = hash; return iframe }

    // createSingleSlaveSkeleton :: iframe -> String
    function createSingleSlaveSkeleton (iframe) {
      return `_${iframe.id}._,`
    }

    // injectAfterLoad :: Array String -> Array iframes -> Effect Array iframes
    const injectAfterLoad = (hash, iframe, index) => {
      iframe.addEventListener('load', function () {
        getIframes()[index].contentWindow.location.hash = hash
      })
    }

    if (window.location.hash === "") {
      setDefaultHashFrom(iframes)
    } else {
      const restoredHashes = extractHashesFor(location.hash)(iframes)
      F.map2(injectAfterLoad)(restoredHashes)(iframes)
    }
    F.map(bindRouting)(iframes)
  }
  init()

}
