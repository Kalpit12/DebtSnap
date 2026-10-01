// Simulates the KSh 5,000 → 2,000 payment → 3,000 remaining flow using pure logic.

function calculateDebtRemaining(debt) {
  return Math.max(0, debt.originalAmount - debt.amountPaid);
}

function getDebtStatus(debt, now = new Date()) {
  const remaining = calculateDebtRemaining(debt);
  if (remaining === 0) return 'PAID';
  if (debt.dueDate) {
    const due = new Date(debt.dueDate);
    due.setHours(23, 59, 59, 999);
    if (due < now && remaining > 0) return 'OVERDUE';
  }
  if (debt.amountPaid > 0 && remaining > 0) return 'PARTIALLY_PAID';
  return 'ACTIVE';
}

function calculateDashboardTotals(debts) {
  let owedToMe = 0;
  let iOwe = 0;
  for (const debt of debts) {
    const remaining = calculateDebtRemaining(debt);
    if (remaining <= 0) continue;
    if (debt.direction === 'THEY_OWE_ME') owedToMe += remaining;
    else iOwe += remaining;
  }
  return { owedToMe, iOwe, netBalance: owedToMe - iOwe };
}

function getDebtProgress(debt) {
  return Math.min(100, (debt.amountPaid / debt.originalAmount) * 100);
}

let debt = {
  originalAmount: 5000,
  amountPaid: 0,
  direction: 'THEY_OWE_ME',
  dueDate: undefined,
};

console.assert(getDebtStatus(debt) === 'ACTIVE', 'Step 1: should be ACTIVE');
console.assert(calculateDebtRemaining(debt) === 5000, 'Step 1: remaining 5000');
console.assert(calculateDashboardTotals([debt]).owedToMe === 5000, 'Step 1: home owed 5000');

debt = { ...debt, amountPaid: 2000 };
console.assert(getDebtStatus(debt) === 'PARTIALLY_PAID', 'Step 2: should be PARTIALLY_PAID');
console.assert(calculateDebtRemaining(debt) === 3000, 'Step 2: remaining 3000');
console.assert(getDebtProgress(debt) === 40, 'Step 2: 40% paid');

debt = { ...debt, amountPaid: 5000 };
console.assert(getDebtStatus(debt) === 'PAID', 'Step 3: should be PAID');
console.assert(calculateDebtRemaining(debt) === 0, 'Step 3: remaining 0');
console.assert(calculateDashboardTotals([debt]).owedToMe === 0, 'Step 3: home owed 0');

console.log('All flow checks passed.');
