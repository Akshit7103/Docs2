// ============================================================================
// bsmdev — why is the "Assign analysts" picker empty?
// Runs the SAME sys_user query the wizard-list widget uses. Run in Scripts -
// Background, application scope = "Names and Forms OTC BSM" (so it reproduces the
// widget's cross-scope read).
// ============================================================================
(function () {
  var ug = new GlideRecord('sys_user');
  ug.addActiveQuery();
  ug.addNotNullQuery('email');
  ug.addQuery('email', 'NOT LIKE', 'example.com');   // exclude demo users
  ug.addQuery('email', 'NOT LIKE', 'email.com');     // exclude demo users
  ug.orderBy('name');
  ug.setLimit(25);
  ug.query();

  gs.info('[USERS] matching count = ' + ug.getRowCount());
  var n = 0;
  while (ug.next() && n < 25) {
    n++;
    gs.info('  ' + ug.getValue('name') + '  |  ' + ug.getValue('email'));
  }
  if (ug.getRowCount() === 0) {
    gs.info('[USERS] 0 rows -> either cross-scope read of sys_user is blocked for this app, or all users are demo-domain.');
  }
})();
