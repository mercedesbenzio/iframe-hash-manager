import logic from './logic.js'
import {test} from 'ava'

const testMasterHash = "#_td.schedule?tdbLng=en&tdbCC=GB&tdbMCID=s-class&tdbMBTID=coupe&tdbTransmission=AUTOMATIC&tdbFuelType=PETROL&dealerOutletId=GS0001780_,"
 + "_dcp.aroisetn#$%@#$@#$dcp_,"
 + "_ovs.aeitson^!@#$@#RSTDRorntoaersteo_++)()*))_,"

test('extraction', t => {
  t.plan(2)
  t.is(logic.extractFromMaster("dcp", testMasterHash), 'aroisetn#$%@#$@#$dcp')
  t.is(logic.extractFromMaster("ovs", testMasterHash),  'aeitson^!@#$@#RSTDRorntoaersteo_++)()*))')
})

test('invalid extraction', t =>
  t.is(logic.extractFromMaster("notfoundyet", testMasterHash), undefined)
)

test('inject', t =>
  t.is(
    logic.injectIntoMaster("td", "SUCCESS", testMasterHash)
    , '#_td.SUCCESS_,_dcp.aroisetn#$%@#$@#$dcp_,_ovs.aeitson^!@#$@#RSTDRorntoaersteo_++)()*))_,')
)

test('wrap', t =>
  t.is(logic.wrap("some/route"), "#/some/route")
)
test('unwrapHash', t =>
  t.is(logic.unwrapHash("someUrl.com/#/some/route"), "some/route")
)
