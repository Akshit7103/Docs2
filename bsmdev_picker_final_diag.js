// ============================================================================
// bsmdev — confirm the demo_users picker filter is deployed + would match users.
// Run in Scripts - Background, application scope = GLOBAL. Read-only.
// ============================================================================
(function () {
  // 1) Which version is actually deployed on the widget right now?
  var wg = new GlideRecord('sp_widget');
  wg.addQuery('id', 'nfotcbsm-wizard-list');
  wg.query();
  if (wg.next()) {
    var ss = '' + (wg.getValue('script') || '');
    gs.info('[D] widget script length = ' + ss.length);
    gs.info('[D] has demo_users filter (_demoSet) = ' + (ss.indexOf('_demoSet') > -1));
    gs.info('[D] STILL has old role filter (_allowed) = ' + (ss.indexOf('_allowed') > -1));
  } else { gs.info('[D] widget nfotcbsm-wizard-list NOT found'); }

  // 2) the property value
  var prop = gs.getProperty('x_nose_nfotc_bsm.demo_users', '(UNSET)');
  gs.info('[D] x_nose_nfotc_bsm.demo_users = ' + prop);

  // 3) which of those user_names actually exist as active users with email
  var names = ('' + prop).split(',');
  var matched = 0;
  for (var i = 0; i < names.length; i++) {
    var nm = ('' + names[i]).trim();
    if (!nm) { continue; }
    var u = new GlideRecord('sys_user');
    u.addQuery('user_name', nm);
    u.setLimit(1);
    u.query();
    if (u.next()) {
      matched++;
      gs.info('  MATCH user_name=' + nm + ' -> ' + (u.getValue('name') || u.getValue('email')) +
              ' | active=' + u.getValue('active') + ' | email=' + (u.getValue('email') || '(none)'));
    } else {
      gs.info('  NO sys_user with user_name=' + nm);
    }
  }
  gs.info('[D] users the picker SHOULD show = ' + matched);
})();
