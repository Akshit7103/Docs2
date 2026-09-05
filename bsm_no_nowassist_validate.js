// ============================================================================
// BSM — validate "Now Assist removed, direct Chinou" end-to-end.
// Run in Scripts - Background with application scope = "Names and Forms OTC BSM".
//
// Exercises all three AI paths that used to go through Now Assist (NASK/OneExtend)
// and now call global.ChinouClient directly. All PASS = BSM runs fully on direct
// Chinou with no Now Assist dependency.
// ============================================================================
(function () {
  var pass = 0, fail = 0;
  function check(name, ok, detail) {
    gs.info('[BSM-VALIDATE] ' + (ok ? 'PASS' : 'FAIL') + '  ' + name + (detail ? ('   :: ' + detail) : ''));
    if (ok) { pass++; } else { fail++; }
  }

  var sample =
    'Subject: Payment confirmation\n\n' +
    'Reference | Ccy | Amount       | Value Date | Direction\n' +
    '354550173 | EUR | 1,497,447.18 | 2026-06-13 | Pay\n' +
    '349044605 | JPY | 1,811,339.36 | 2026-06-13 | Pay';

  // 1) single value (per-field) — direct Chinou
  try {
    var r1 = new x_nose_nfotc_bsm.GenericFieldExtractor()
      .extract('Return ONLY the settlement currency of the FIRST row as a 3-letter ISO code.', sample);
    var ccy = ('' + (r1.value || '')).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    check('GenericFieldExtractor.extract (single value)', r1.status === 'ok' && ccy === 'EUR',
          'status=' + r1.status + ' value="' + r1.value + '"');
  } catch (e) { check('GenericFieldExtractor.extract', false, '' + e); }

  // 2) records (multi-trade) — the MAIN extraction path
  try {
    var r2 = new x_nose_nfotc_bsm.GenericFieldExtractor().extractRecords(
      'Extract EVERY row as a JSON array; each object exactly {"value_date":"YYYY-MM-DD","amount":"","currency":"","direction":""}. No commentary.',
      sample);
    check('GenericFieldExtractor.extractRecords (multi-row)',
          r2.status === 'ok' && r2.rows && r2.rows.length === 2,
          'status=' + r2.status + ' rows=' + (r2.rows ? r2.rows.length : 0));
  } catch (e) { check('GenericFieldExtractor.extractRecords', false, '' + e); }

  // 3) prompt enhancer — direct Chinou (generation, not extraction)
  try {
    var r3 = new x_nose_nfotc_bsm.PromptEnhancer().enhance('get the value date', 'Value Date', '');
    check('PromptEnhancer.enhance', r3.status === 'ok' && ('' + r3.text).length > 15,
          'status=' + r3.status + ' text="' + ('' + r3.text).substring(0, 70) + '..."');
  } catch (e) { check('PromptEnhancer.enhance', false, '' + e); }

  // 4) demo-page extractor — direct Chinou
  try {
    var r4 = new x_nose_nfotc_bsm.AiFieldExtractor().extract(sample);
    check('AiFieldExtractor.extract (demo page)',
          (r4.status === 'cashflow' || r4.status === 'ok') && r4.flow_count >= 2,
          'status=' + r4.status + ' flows=' + r4.flow_count);
  } catch (e) { check('AiFieldExtractor.extract', false, '' + e); }

  gs.info('[BSM-VALIDATE] ============================================================');
  gs.info('[BSM-VALIDATE] ' + pass + ' PASS / ' + fail + ' FAIL — ' +
          (fail === 0 ? 'BSM runs fully on DIRECT CHINOU with NO Now Assist dependency.'
                      : 'see failures above.'));
  gs.info('[BSM-VALIDATE] ============================================================');
})();
