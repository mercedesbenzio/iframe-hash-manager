(function iframeHashManager (window) {
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


  const compose = functions => initial => functions.reverse().reduceRight(
      (result, fn) => fn(result),
      initial
  );

  // map :: (a -> b) -> Array a -> Array b
  const map = fn => arr => arr.map(fn)

  // join :: Array String -> String
  const join = delimiter => arr => arr.join(delimiter)

  // log :: a -> a
  const log = tag => data => {console.log(tag, data); return data}



  // extractFromMaster :: String -> String -> String
  function extractFromMaster( slaveHashId, masterHash ) {
    // delimiters are hard-coded: _[id]. and _,
    const slaveHashPattern = new RegExp( "_" + slaveHashId + "\.(.*?)_," )
    const matches = slaveHashPattern.exec(masterHash)
    // fallback pattern to handle empty matches
    return (matches || [])[1] // get first capturing group
  }


  // injectIntoMaster :: String -> String -> String
  function injectIntoMaster(slaveHashId, newSlaveHash, masterHash) {
    const oldSlaveHash = extractFromMaster(slaveHashId, masterHash)
    if (oldSlaveHash) {
      return masterHash.replace(oldSlaveHash, newSlaveHash)
    }
    return masterHash + "_" + slaveHashId + "." + newSlaveHash + "_,"
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
    const updateUrl = compose([injectIntoMaster, writeToLocation])
    const hash = unwrapHash(ev.newURL)
    const appId = iframe.id
    writeToLocation(injectIntoMaster(appId, hash, window.location.hash))
  }








  // INTEGRATION
  // Because the event listeners get detached on load, a special procedure is required
  // 1. wait for all the iframes to load
  // 2. re-attach the event listeners for hash change onto the iframe
  function INTEGRATE () {

    function attachListenerToiframe (iframeIndex, eventId, handler) {
      getIframes()[iframeIndex].contentWindow.addEventListener(eventId, handler)
    }

    function getIframes () {
      return Array.from(document.getElementsByTagName('iframe'))
    }

    function attachListener (iframe, index) {
      iframe.addEventListener('load', function () {
        attachListenerToiframe(index, 'hashchange', handleSlaveHashChangeFor(iframe))
      })
      return iframe
    }

    compose([
      getIframes,
      map(attachListener),
      map(createSingleSlaveSkeleton),
      join(''),
      wrap,
      writeToLocation
    ])()

    function createSingleSlaveSkeleton (iframe) {
      return `_${iframe.id}._,`
    }

  }

  INTEGRATE()

})(this)
