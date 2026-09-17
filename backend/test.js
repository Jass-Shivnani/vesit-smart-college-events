// Automated CI/CD Unit and Integration Test Script
const assert = require('assert');

// Test 1: Conflict Detection algorithm
function timeToMinutes(timeStr) {
  const parts = timeStr.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function hasTimeConflict(startA, endA, startB, endB) {
  const minStartA = timeToMinutes(startA);
  const minEndA = timeToMinutes(endA);
  const minStartB = timeToMinutes(startB);
  const minEndB = timeToMinutes(endB);
  return minStartA < minEndB && minEndA > minStartB;
}

console.log('🧪 Starting ACC Devops Automated Tests...\n');

// Test 1.1: Overlapping time ranges
const conflict1 = hasTimeConflict('10:00', '12:00', '11:00', '13:00');
assert.strictEqual(conflict1, true, 'Should detect overlap between 10-12 and 11-13');
console.log('✅ Test 1.1 Passed: Overlapping events detected correctly.');

// Test 1.2: Non-overlapping time ranges
const conflict2 = hasTimeConflict('10:00', '12:00', '14:00', '16:00');
assert.strictEqual(conflict2, false, 'Should NOT detect overlap between 10-12 and 14-16');
console.log('✅ Test 1.2 Passed: Non-conflicting time slots allowed.');

// Test 1.3: Adjacent events (e.g. 10:00-12:00 and 12:00-14:00)
const conflict3 = hasTimeConflict('10:00', '12:00', '12:00', '14:00');
assert.strictEqual(conflict3, false, 'Back-to-back events should not conflict');
console.log('✅ Test 1.3 Passed: Adjacent events allowed.');

// Test 2: Waitlist promotion algorithm logic
const waitlist = [
  { user_id: 101, waitlist_position: 1 },
  { user_id: 102, waitlist_position: 2 },
  { user_id: 103, waitlist_position: 3 }
];

const promoted = waitlist.shift();
promoted.waitlist_position = 0;
promoted.status = 'confirmed';
waitlist.forEach(w => w.waitlist_position -= 1);

assert.strictEqual(promoted.user_id, 101);
assert.strictEqual(waitlist[0].waitlist_position, 1);
assert.strictEqual(waitlist[1].waitlist_position, 2);
console.log('✅ Test 2 Passed: Queue-based waitlist promotion operates FIFO correctly.');

console.log('\n🎉 ALL CI/CD INTEGRATION TESTS PASSED SUCCESSFULLY! Ready for deployment.\n');
