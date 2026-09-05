/**
 * Work Driver Onboarding Wizard — LIST page (server).
 * Lists configured wizards split into Published / Drafts, with filter option lists and the
 * "copy an existing wizard" source list for the create modal. Delete happens here too.
 *
 * Access is gated by ROLE on the landing page (manager/admin only), so there is no separate
 * password gate on this page.
 */
(function () {
    function hasExplicitRole(roleName) {
        try {
            var roles = gs.getUser().getRoles();
            if (!roles) { return false; }
            for (var i = 0; i < roles.length; i++) { if (('' + roles[i]) === roleName) { return true; } }
        } catch (e) { /* fall through */ }
        return false;
    }
    var cm = new x_nose_nfotc_bsm.CompareMatch();
    data.logo = cm.LOGO;
    data.name = cm.titleCase(gs.getUserDisplayName() || 'Analyst');
    data.isAdmin = gs.hasRole('admin');

    // Option catalogs for the per-card Settings panel (edit the wizard record's config fields inline).
    data.cat = {
        taxonomy: cm.taxonomy(),
        inputFormats: ['Email', 'PDF', 'Excel'],
        ingestionTypes: ['Mail', 'API', 'File Drop', 'Manual'],
        frequencies: ['Real-time', 'Hourly', 'Daily'],
        targetSystems: ['System 1', 'System 2', 'PCM']
    };
    data.isManager = hasExplicitRole('x_nose_nfotc_bsm.manager');
    data.role = new x_nose_nfotc_bsm.AccessGuard().roleLabel();
    var wlp = ('' + data.name).trim().split(/\s+/);
    data.initials = ((wlp[0] || 'U').charAt(0) + (wlp.length > 1 ? wlp[wlp.length - 1].charAt(0) : '')).toUpperCase();

    // Delete a wizard (trash icon on a card).
    if (input && input.action === 'delete' && input.wizardId) {
        var dg = new GlideRecord('x_nose_nfotc_bsm_wizard');
        if (dg.get(input.wizardId)) { dg.deleteRecord(); }
    }

    // Settings (gear icon on a card): edit the wizard record's configuration fields inline and write them
    // straight back to x_nose_nfotc_bsm_wizard — the same fields shown on the native record form.
    if (input && input.action === 'save_config' && input.wizardId && input.cfg) {
        var cfgIn = {};
        try { cfgIn = JSON.parse(input.cfg); } catch (ec) { cfgIn = {}; }
        var cg = new GlideRecord('x_nose_nfotc_bsm_wizard');
        if (cg.get(input.wizardId)) {
            var FMAP = {
                description: 'description', bu: 'bu', subBu: 'sub_bu', service: 'service', activity: 'activity',
                workDriver: 'work_driver', mailbox: 'mailbox', inputFormat: 'input_format',
                ingestionType: 'ingestion_type', frequency: 'frequency', target: 'target_system', version: 'version'
            };
            for (var mk in FMAP) {
                if (Object.prototype.hasOwnProperty.call(cfgIn, mk)) { cg.setValue(FMAP[mk], '' + (cfgIn[mk] == null ? '' : cfgIn[mk])); }
            }
            cg.update();
            data.configSaved = input.wizardId;
            // (Wizard configuration is intentionally NOT written to the cashflow audit trail.)
        }
    }

    // Assign a published workflow to real people: store the list on the wizard AND grant them the
    // analyst role (best-effort) so they can actually run it.
    if (input && input.action === 'assign' && input.wizardId) {
        var wg2 = new GlideRecord('x_nose_nfotc_bsm_wizard');
        if (wg2.get(input.wizardId)) {
            var ids = ('' + (input.userIds || '')).split(',');
            var analystRoleId = '';
            var rr = new GlideRecord('sys_user_role');
            if (rr.get('name', 'x_nose_nfotc_bsm.analyst')) { analystRoleId = rr.getUniqueValue(); }
            var list = [];
            for (var ai = 0; ai < ids.length; ai++) {
                var uid = ids[ai];
                if (!uid) { continue; }
                var ug2 = new GlideRecord('sys_user');
                if (!ug2.get(uid)) { continue; }
                list.push({ id: uid, name: ug2.getValue('name') || ug2.getValue('email') });
                if (analystRoleId) {
                    try {
                        var chk = new GlideRecord('sys_user_has_role');
                        chk.addQuery('user', uid);
                        chk.addQuery('role', analystRoleId);
                        chk.query();
                        if (!chk.hasNext()) {
                            var ins = new GlideRecord('sys_user_has_role');
                            ins.initialize();
                            ins.setValue('user', uid);
                            ins.setValue('role', analystRoleId);
                            ins.insert();
                        }
                    } catch (e) { /* role grant best-effort (may be restricted) */ }
                }
            }
            wg2.setValue('assigned_users', JSON.stringify(list));
            wg2.setValue('assigned_count', list.length);
            wg2.update();
        }
    }

    // Assignable people — the provisioned operator allow-list, from the x_nose_nfotc_bsm.demo_users
    // property (comma-separated user_names). This shows exactly the onboarded people (same set as eval),
    // not the whole directory. Reads only the property + sys_user (both readable in a user session), so it
    // avoids the cross-scope role-table reads that a scoped user session blocks. To add a new analyst:
    // add their user_name to x_nose_nfotc_bsm.demo_users (and grant them the analyst role).
    data.users = [];
    var _demo = ('' + (gs.getProperty('x_nose_nfotc_bsm.demo_users', '') || ''))
        .split(',').map(function (s) { return ('' + s).trim(); }).filter(function (s) { return s; });
    if (_demo.length) {
        // Targeted lookup by user_name — NOT a fetch-everything-then-filter. bsmdev's directory has
        // thousands of users (many with a blank name that sort first), so a row-limited scan would push
        // the real operators past the cap. Querying the exact user_names returns just them.
        var ug = new GlideRecord('sys_user');
        ug.addQuery('user_name', 'IN', _demo.join(','));
        ug.addActiveQuery();
        ug.query();
        while (ug.next()) {
            var unm = ug.getValue('name') || ug.getValue('email') || ug.getValue('user_name');
            data.users.push({ id: ug.getUniqueValue(), name: unm, email: (ug.getValue('email') || '') });
        }
    }

    function fieldCount(json) {
        try { var a = JSON.parse(json || '[]'); return a.length; } catch (e) { return 0; }
    }
    function assignedList(json) {
        try { return JSON.parse(json || '[]'); } catch (e) { return []; }
    }

    data.published = [];
    data.drafts = [];
    data.allWizards = [];
    var gr = new GlideRecord('x_nose_nfotc_bsm_wizard');
    gr.orderByDesc('sys_updated_on');
    gr.query();
    while (gr.next()) {
        var cardActivity = gr.getValue('activity') || 'Compare & Match';
        var cardWd = gr.getValue('work_driver') || '';
        var rtc = cm.resolveTaxonomy(gr.getValue('bu') || '', gr.getValue('sub_bu') || '', gr.getValue('service') || '', cardWd);
        var card = {
            id: gr.getUniqueValue(),
            name: gr.getValue('name') || 'Untitled wizard',
            description: gr.getValue('description') || '',
            bu: rtc.bu, subBu: rtc.subBu, service: rtc.service,
            workDriver: cardWd,
            activity: cardActivity,
            inputFormat: gr.getValue('input_format') || 'Email',
            ingestionType: gr.getValue('ingestion_type') || 'Mail',
            frequency: gr.getValue('frequency') || 'Real-time',
            source: gr.getValue('mailbox') || '',
            mailbox: gr.getValue('mailbox') || '',
            target: gr.getValue('target_system') || '',
            version: gr.getValue('version') || 'v1',
            fieldCount: fieldCount(gr.getValue('input_fields')),
            status: gr.getValue('status') || 'draft'
        };
        var au = assignedList(gr.getValue('assigned_users'));
        card.assigned = au.length;
        card.assignedIds = au.map(function (u) { return u.id; });
        data.allWizards.push({ id: card.id, name: card.name });
        if (card.status === 'published') { data.published.push(card); } else { data.drafts.push(card); }
    }

    // Filter option lists (chips).
    data.workDrivers = ['Non Pari-ff Prematching', 'OTC Settlements', 'Position Management / Depot Transfer'];
    data.activities = ['Compare & Match', 'Reconcile', 'Validate'];
})();
