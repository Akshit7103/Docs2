// ============================================================================
// bsmdev — make akshit.mahajan@nomura.com the FULL superuser (like eval):
//   1) assign to the OTC work-driver
//   2) grant x_nose_nfotc_bsm.analyst + x_nose_nfotc_bsm.manager roles
//   3) add to x_nose_nfotc_bsm.demo_users -> the Manager/Analyst view-as toggle
// Run in Scripts - Background, application scope = "Names and Forms OTC BSM". Idempotent.
// ============================================================================
(function () {
  var EMAIL = 'akshit.mahajan@nomura.com';
  var USER_ID = 'muralia';                              // fallback lookup + the demo_users key (gs.getUserName)
  var ROLES = ['x_nose_nfotc_bsm.analyst', 'x_nose_nfotc_bsm.manager'];
  var DEMO_PROP = 'x_nose_nfotc_bsm.demo_users';

  // ---- 0) find the user ----
  var u = new GlideRecord('sys_user');
  u.addQuery('email', EMAIL); u.setLimit(1); u.query();
  if (!u.next()) {
    u = new GlideRecord('sys_user'); u.addQuery('user_name', USER_ID); u.setLimit(1); u.query();
    if (!u.next()) { gs.info('[SU] user NOT found (email=' + EMAIL + ' / user_name=' + USER_ID + ')'); return; }
  }
  var uid = u.getUniqueValue();
  var uname = u.getValue('user_name');
  var disp = u.getValue('name') || u.getValue('email') || uname;
  gs.info('[SU] user = ' + disp + '  | user_name=' + uname + '  (' + uid + ')');

  // ---- 1) assign to the OTC work-driver ----
  var w = new GlideRecord('x_nose_nfotc_bsm_wizard');
  w.addQuery('work_driver', 'CONTAINS', 'OTC'); w.orderBy('sys_created_on'); w.setLimit(1); w.query();
  var found = w.next();
  if (!found) { w = new GlideRecord('x_nose_nfotc_bsm_wizard'); w.orderBy('sys_created_on'); w.setLimit(1); w.query(); found = w.next(); }
  if (found) {
    var list = []; try { list = JSON.parse(w.getValue('assigned_users') || '[]'); } catch (e) { list = []; }
    if (!(list instanceof Array)) { list = []; }
    var has = false; for (var i = 0; i < list.length; i++) { if (list[i] && list[i].id === uid) { has = true; break; } }
    if (!has) { list.push({ id: uid, name: disp }); }
    w.setValue('assigned_users', JSON.stringify(list));
    w.setValue('assigned_count', list.length);
    w.update();
    gs.info('[SU] assigned to "' + w.getValue('name') + '" -> ' + JSON.stringify(list));
  } else { gs.info('[SU] no wizard found (skipped assign)'); }

  // ---- 2) grant both roles (best-effort; cross-scope write may be restricted) ----
  for (var r = 0; r < ROLES.length; r++) {
    try {
      var rr = new GlideRecord('sys_user_role');
      if (rr.get('name', ROLES[r])) {
        var roleId = rr.getUniqueValue();
        var chk = new GlideRecord('sys_user_has_role'); chk.addQuery('user', uid); chk.addQuery('role', roleId); chk.query();
        if (!chk.hasNext()) {
          var ins = new GlideRecord('sys_user_has_role'); ins.initialize(); ins.setValue('user', uid); ins.setValue('role', roleId); ins.insert();
          gs.info('[SU] granted role ' + ROLES[r]);
        } else { gs.info('[SU] already has role ' + ROLES[r]); }
      } else { gs.info('[SU] role not found: ' + ROLES[r]); }
    } catch (e) { gs.info('[SU] role grant skipped (' + ROLES[r] + '): ' + e); }
  }

  // ---- 3) view-as toggle: ensure user_name is in demo_users (comma-separated user_names) ----
  try {
    var cur = '' + (gs.getProperty(DEMO_PROP, '') || '');
    var arr = cur.split(',').map(function (s) { return ('' + s).trim(); }).filter(function (s) { return s; });
    if (arr.indexOf(uname) === -1) {
      arr.push(uname);
      gs.setProperty(DEMO_PROP, arr.join(','));
      gs.info('[SU] added ' + uname + ' to ' + DEMO_PROP + ' -> ' + arr.join(','));
    } else { gs.info('[SU] ' + uname + ' already in ' + DEMO_PROP + ' (' + arr.join(',') + ')'); }
  } catch (e) { gs.info('[SU] demo_users update skipped: ' + e); }

  gs.info('[SU] DONE — analyst + manager + view-as toggle + assigned to the work-driver.');
})();
