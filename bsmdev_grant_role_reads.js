// ============================================================================
// bsmdev — grant the BSM app cross-scope READ on sys_user_role + sys_user_has_role
// so the wizard-list widget's analyst-role filter works in a user session.
// Run in Scripts - Background, application scope = GLOBAL. Idempotent.
// ============================================================================
(function () {
  var SRC = 'eff39d2ab73de50d8051b95090f30712';   // x_nose_nfotc_bsm scope
  var TARGET_SCOPE = 'global';
  var reads = ['sys_user_role', 'sys_user_has_role'];

  for (var i = 0; i < reads.length; i++) {
    var tbl = reads[i];
    var chk = new GlideRecord('sys_scope_privilege');
    chk.addQuery('source_scope', SRC);
    chk.addQuery('target_scope', TARGET_SCOPE);
    chk.addQuery('target_name', tbl);
    chk.addQuery('target_type', 'sys_db_object');
    chk.addQuery('operation', 'read');
    chk.query();
    if (chk.next()) {
      if (chk.getValue('status') !== 'allowed') { chk.setValue('status', 'allowed'); chk.update(); gs.info('[GRANT] set allowed: ' + tbl + ' read'); }
      else { gs.info('[GRANT] already allowed: ' + tbl + ' read'); }
    } else {
      var ins = new GlideRecord('sys_scope_privilege');
      ins.initialize();
      ins.setValue('source_scope', SRC);
      ins.setValue('target_scope', TARGET_SCOPE);
      ins.setValue('target_name', tbl);
      ins.setValue('target_type', 'sys_db_object');
      ins.setValue('operation', 'read');
      ins.setValue('status', 'allowed');
      ins.insert();
      gs.info('[GRANT] created: ' + tbl + ' read  (' + ins.getUniqueValue() + ')');
    }
  }
  gs.info('[GRANT] DONE — reload the wizard page + re-open the Assign modal.');
})();
