import {compose, map, map2, join, log, tail, split} from './fp'
import {extractFromMaster, injectIntoMaster, wrap, unwrapHash}} from './logic.js'


// URL format
(function iframeHashManager (window) {
  // writeToLocation :: String -> Effect window.location
  function writeToLocation (hash) {
      history.pushState({}, document.title || "Mercedes Benz", hash);
  };

  // handleSlaveHashChangeFor :: HTMLIFrameElement -> Event hashchange -> Effect window.location
  const handleSlaveHashChangeFor = iframe => ev => {
    const hash = unwrapHash(ev.newURL)
    const appId = iframe.id

    writeToLocation(injectIntoMaster(appId, hash, window.location.hash))
  }

  // getIframes :: Void -> Array iframe
  function getIframes () {
    return Array.from(document.getElementsByTagName('iframe'))
  }

  // INTEGRATION
  // Because the event listeners get detached on load, a special procedure is required
  // 1. wait for all the iframes to load
  // 2. re-attach the event listeners for hash change onto the iframe
  function INTEGRATE () {

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
    const setDefaultHashFrom = compose([
      map(createSingleSlaveSkeleton),
      join(''),
      wrap,
      writeToLocation
    ])

    // extractHashesFor :: Array iframes -> String -> Array String
    const extractHashesFor = masterHash => iframes => {
      var ids = map(iframe => iframe.id)(iframes)
      return map(id => extractFromMaster(id, masterHash))(ids)
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
      map2(injectAfterLoad)(restoredHashes)(iframes)
    }
    map(bindRouting)(iframes)

  }

  if (getIframes().length > 1) INTEGRATE()

})(this)
