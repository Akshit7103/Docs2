// ============================================================================
// bsmdev — BSM handover health check. Run in Scripts - Background,
// application scope = "Names and Forms OTC BSM". Read-only.
// ============================================================================
(function () {
  function count(t) { var g = new GlideRecord(t); g.query(); return g.getRowCount(); }

  gs.info('===== BSM handover health check =====');
  gs.info('  golden bookings   : ' + count('x_nose_nfotc_bsm_booking') + '   (expect ~680)');
  gs.info('  counterparties    : ' + count('x_nose_nfotc_bsm_counterparty') + '   (expect 51)');
  gs.info('  config rows       : ' + count('x_nose_nfotc_bsm_config'));
  gs.info('  work-drivers      : ' + count('x_nose_nfotc_bsm_wizard'));
  gs.info('  emails ingested   : ' + count('x_nose_nfotc_bsm_email'));

  var cf = new GlideRecord('x_nose_nfotc_bsm_cashflow');
  cf.query();
  var total = 0, populated = 0, matched = 0;
  while (cf.next()) {
    total++;
    if (cf.getValue('ai_currency') || cf.getValue('ai_amount')) { populated++; }
    if (cf.getValue('ai_match_computed') === 'true') { matched++; }
  }
  gs.info('  cashflows         : ' + total + '   (AI-extracted: ' + populated + ', match-computed: ' + matched + ')');

  gs.info('===== healthy if: bookings ~680, cashflows AI-extracted = total, no zeros =====');
})();
