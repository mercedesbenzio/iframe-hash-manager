import logic from './logic.js'

const testMasterHash = "#_td.schedule?tdbLng=en&tdbCC=GB&tdbMCID=s-class&tdbMBTID=coupe&tdbTransmission=AUTOMATIC&tdbFuelType=PETROL&dealerOutletId=GS0001780_,"
 + "_dcp.aroisetn#$%@#$@#$dcp_,"
 + "_ovs.aeitson^!@#$@#RSTDRorntoaersteo_++)()*))_,"

// extraction
assert(logic.extractFromMaster("dcp", testMasterHash)         === 'aroisetn#$%@#$@#$dcp', 'extraction')
assert(logic.extractFromMaster("ovs", testMasterHash)         === 'aeitson^!@#$@#RSTDRorntoaersteo_++)()*))', 'extraction')

// not found extraction
assert(logic.extractFromMaster("notfoundyet", testMasterHash) === undefined, 'extraction')

// injection
assert(logic.injectIntoMaster("td", "SUCCESS", testMasterHash) === '#_td.SUCCESS_,_dcp.aroisetn#$%@#$@#$dcp_,_ovs.aeitson^!@#$@#RSTDRorntoaersteo_++)()*))_,', 'injection')

// initial link creation

// conversion
assert(logic.wrap("some/route") === "#/some/route", "wrap")
assert(logic.unwrapHash("someUrl.com/#/some/route") === "some/route", "unwrapHash")

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
