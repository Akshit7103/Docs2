// ============================================================================
// bsmdev — diagnose why the role-filtered picker is empty.
// Run in Scripts - Background, application scope = "Names and Forms OTC BSM".
// ============================================================================
(function () {
  var MURALIA = '5210b31c83bdc790ccc66b50ceaad3dc';   // your sys_user sys_id (from the superuser run)

  // Method 1 — single .get (this is what the superuser script used, and it worked)
  var g = new GlideRecord('sys_user_role');
  gs.info('[F] .get(name, analyst) -> ' + g.get('name', 'x_nose_nfotc_bsm.analyst') + '  id=' + (g.getUniqueValue() || '-'));

  // Method 2 — the IN query the widget uses
  var rr = new GlideRecord('sys_user_role');
  rr.addQuery('name', 'IN', 'x_nose_nfotc_bsm.analyst,x_nose_nfotc_bsm.manager');
  rr.query();
  gs.info('[F] IN-query sys_user_role count = ' + rr.getRowCount());
  var ids = [];
  while (rr.next()) { ids.push(rr.getUniqueValue()); gs.info('    role: ' + rr.getValue('name') + ' (' + rr.getUniqueValue() + ')'); }

  if (!ids.length) { gs.info('[F] STOP: role query returned nothing.'); return; }

  var uhr = new GlideRecord('sys_user_has_role');
  uhr.addQuery('role', 'IN', ids.join(','));
  uhr.query();
  gs.info('[F] sys_user_has_role count = ' + uhr.getRowCount());
  var seen = {};
  while (uhr.next()) { seen[uhr.getValue('user')] = true; }
  gs.info('[F] distinct role-holders = ' + Object.keys(seen).length);
  gs.info('[F] muralia in allowed set? ' + (!!seen[MURALIA]));
})();
