// ============================================================================
// bsmdev — isolate the ChinouClient.invoke failure.
// Run in Scripts - Background, application scope = "Names and Forms OTC BSM"
// (so it uses the same global.ChinouClient path the app does).
// ============================================================================
(function () {
  try {
    var cc = new global.ChinouClient();
    gs.info('[CC-TEST] ChinouClient instantiated | typeof invoke = ' + (typeof cc.invoke));

    var r = cc.invoke('Reply with exactly the two letters: OK');

    gs.info('[CC-TEST] success = ' + (r && r.success));
    gs.info('[CC-TEST] status  = ' + (r && r.status));
    gs.info('[CC-TEST] model   = ' + (r && r.model));
    gs.info('[CC-TEST] response= ' + (r && ('' + r.response).substring(0, 300)));
    gs.info('[CC-TEST] error   = ' + (r && r.error));
  } catch (e) {
    gs.info('[CC-TEST] EXCEPTION: ' + (e.message || e));
    gs.info('[CC-TEST] STACK: ' + (e.stack || '(no stack available)'));
  }
})();
