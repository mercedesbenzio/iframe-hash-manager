
// URL format
(function iframeHashManager (window) {

  // FP Primitive helpers
  // compose :: List (a -> b) -> (a -> b)
  const compose = functions => initial => functions.reverse().reduceRight(
      (result, fn) => fn(result),
      initial
  );

  // map :: (a -> b) -> Array a -> Array b
  const map = fn => arr => arr.map(fn)

  // map :: (a -> b -> c) -> Array a -> Array b -> Array c
  const map2 = fn => arr1 => arr2 => arr1.map((el, index) => fn(el, arr2[index], index))

  // join :: Array String -> String
  const join = delimiter => arr => arr.join(delimiter)

  // log :: a -> a
  const log = tag => data => {console.dir(tag, data); return data}

  // tail :: Array a -> Array (Maybe a)
  const tail = arr => arr.slice(1, arr.length)

  // split :: String -> Array String
  const split = delim => str => str.split(delim)

  function TEST () {

    testMasterHash = "#_td.schedule?tdbLng=en&tdbCC=GB&tdbMCID=s-class&tdbMBTID=coupe&tdbTransmission=AUTOMATIC&tdbFuelType=PETROL&dealerOutletId=GS0001780_,"
     + "_dcp.aroisetn#$%@#$@#$dcp_,"
     + "_ovs.aeitson^!@#$@#RSTDRorntoaersteo_++)()*))_,"

    // extraction
    assert(extractFromMaster("dcp", testMasterHash)         === 'aroisetn#$%@#$@#$dcp', 'extraction')
    assert(extractFromMaster("ovs", testMasterHash)         === 'aeitson^!@#$@#RSTDRorntoaersteo_++)()*))', 'extraction')

    // not found extraction
    assert(extractFromMaster("notfoundyet", testMasterHash) === undefined, 'extraction')

    // injection
    assert(injectIntoMaster("td", "SUCCESS", testMasterHash) === '#_td.SUCCESS_,_dcp.aroisetn#$%@#$@#$dcp_,_ovs.aeitson^!@#$@#RSTDRorntoaersteo_++)()*))_,', 'injection')

    // initial link creation

    // conversion
    assert(wrap("some/route") === "#/some/route", "wrap")
    assert(unwrapHash("someUrl.com/#/some/route") === "some/route", "unwrapHash")

    function assert(condition, message) {
        if (!condition) {
            message = message + "failed" || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
        if (condition) {
          console.log(message, 'succeeded')
        }
    }
  }

  // TEST()



  // extractFromMaster :: String -> String -> String
  function extractFromMaster( slaveHashId, masterHash ) {
    // delimiters are hard-coded: _[id]. and _,
    const slaveHashPattern = new RegExp( `_${slaveHashId}\.(.*?)_,` )
    const matches = slaveHashPattern.exec(masterHash)
    // fallback pattern to handle empty matches
    return (matches || [])[1] // get first capturing group
  }


  // injectIntoMaster :: String -> String -> String
  function injectIntoMaster(slaveHashId, newSlaveHash, masterHash) {

    const startDelimiter = `_${slaveHashId}.`
    const endDelimiter = '_,'

    const parts = masterHash.split(startDelimiter)
    const urlHead = parts[0]

    // just remove the rest of the
    const urlTail = compose([
      split(endDelimiter),
      tail,
      join(endDelimiter)
    ])(parts[1])

    return urlHead
         + startDelimiter + newSlaveHash + endDelimiter // new encodede slave hash
         + urlTail
  }



  // wrap :: String -> String
  // converts some/route to #/some/route
  function wrap (hashValue) { return "#/" + ( hashValue || "" ) }

  // unwrapHash :: String -> String
  // converts someUrl.com/#/some/route to some/route
  function unwrapHash (url) { return url.split('#/')[1]}

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








  // INTEGRATION
  // Because the event listeners get detached on load, a special procedure is required
  // 1. wait for all the iframes to load
  // 2. re-attach the event listeners for hash change onto the iframe
  function INTEGRATE () {


    // getIframes :: Void -> Array iframe
    function getIframes () {
      return Array.from(document.getElementsByTagName('iframe'))
    }

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

  INTEGRATE()

})(this)
