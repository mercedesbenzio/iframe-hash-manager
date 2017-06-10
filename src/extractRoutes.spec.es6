import test from 'ava'
import * as extract from './extractRoutes'

const multiHash = '#multi/app.active_,_app2.completed_,_app3._,'
const singleHash = '#/some/random/path?query=param'

test('from single hash', t => t.deepEqual(
    extract.fromHash(singleHash)
  , [ {id: 'default', value: 'some/random/path?query=param'} ]
))

test('from multi hash', t => t.deepEqual(
    extract.fromHash(multiHash),
    [ {id: 'app',  value: 'active'},
      {id: 'app2', value: 'completed'},
      {id: 'app3', value: ''} ]
))

test('from no hash', t => t.deepEqual(
    extract.fromHash(undefined), []
))


test('from no iframes', t => t.deepEqual(
    extract.fromIframes( iframe => iframe.id )(undefined), []
))
