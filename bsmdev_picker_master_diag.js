// ============================================================================
// bsmdev — master diagnostic for the empty "Assign analysts" picker.
// Run in Scripts - Background, application scope = GLOBAL. Read-only.
// ============================================================================
(function () {
  var BSM = 'eff39d2ab73de50d8051b95090f30712';   // x_nose_nfotc_bsm scope

  // 1) ALL cross-scope privileges the BSM app has (compare the WORKING sys_user read
  //    vs the sys_user_role / sys_user_has_role reads we created).
  gs.info('===== 1. BSM cross-scope privileges =====');
  var sp = new GlideRecord('sys_scope_privilege');
  sp.addQuery('source_scope', BSM);
  sp.orderBy('target_name');
  sp.query();
  var spc = 0;
  while (sp.next()) {
    spc++;
    gs.info('  name=' + sp.getValue('target_name') +
            ' | type=' + sp.getValue('target_type') +
            ' | target_scope=' + sp.getValue('target_scope') +
            ' | op=' + sp.getValue('operation') +
            ' | status=' + sp.getValue('status'));
  }
  gs.info('  (' + spc + ' privileges)');

  // 2) Did the role-filter paste actually save into the deployed widget?
  gs.info('===== 2. widget server-script check =====');
  var wg = new GlideRecord('sp_widget');
  wg.addQuery('id', 'nfotcbsm-wizard-list');
  wg.query();
  if (wg.next()) {
    var ss = '' + (wg.getValue('script') || '');
    gs.info('  widget "' + wg.getValue('name') + '" (' + wg.getUniqueValue() + ')');
    gs.info('  has _allowed filter: ' + (ss.indexOf('_allowed') > -1));
    gs.info('  has role IN-query   : ' + (ss.indexOf('x_nose_nfotc_bsm.analyst,x_nose_nfotc_bsm.manager') > -1));
    gs.info('  script length       : ' + ss.length);
  } else { gs.info('  widget id nfotcbsm-wizard-list NOT FOUND'); }

  // 3) role-filter counts (global context — confirms the data exists)
  gs.info('===== 3. role data =====');
  var ids = [];
  var rr = new GlideRecord('sys_user_role');
  rr.addQuery('name', 'IN', 'x_nose_nfotc_bsm.analyst,x_nose_nfotc_bsm.manager');
  rr.query();
  while (rr.next()) { ids.push(rr.getUniqueValue()); }
  gs.info('  roles found = ' + ids.length);
  var holders = 0;
  if (ids.length) { var uhr = new GlideRecord('sys_user_has_role'); uhr.addQuery('role', 'IN', ids.join(',')); uhr.query(); while (uhr.next()) { holders++; } }
  gs.info('  role assignments = ' + holders);

  // 4) what is currently assigned on the OTC work-driver
  gs.info('===== 4. wizard assigned_users =====');
  var w = new GlideRecord('x_nose_nfotc_bsm_wizard');
  w.addQuery('work_driver', 'CONTAINS', 'OTC'); w.setLimit(1); w.query();
  if (w.next()) { gs.info('  "' + w.getValue('name') + '" -> ' + w.getValue('assigned_users')); }

  gs.info('===== DONE =====');
})();
