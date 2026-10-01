import assert from 'node:assert/strict';
import {finalDefaults,evaluateFinal} from '../src/v2/final-model.ts';
assert.equal(evaluateFinal({...finalDefaults,isolate:true},0).nodes.db,'ok','isolated API cannot keep showing an active cross-document read');
assert.equal(evaluateFinal({...finalDefaults,isolate:true},2).nodes.db,'bad','isolating API does not revoke the compromised worker');
console.log('PASS isolated API path and independent compromised worker consequence');
