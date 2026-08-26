# NFOTC — Official ServiceNow Documentation (reference for new developers)

A curated list of **official ServiceNow docs**, mapped to the parts of our app. Use these alongside the *NFOTC Developer Guide*. Every link is verified working.

**How ServiceNow docs work (quick tip):**
- Links starting `…/docs/r/…` are **release-agnostic** — they always open the *latest* version. Prefer these.
- Links with a release name (`…/docs/bundle/zurich-…`) are **pinned to a version**; still valid, just tied to that release.
- To find anything else, use the docs search at **https://www.servicenow.com/docs**.

---

## 1. Getting oriented — Studio, scopes, applications
*(Guide: Parts A & C — what an app/scope is, and Studio, your main workshop.)*
- **Application scope (what a scope is, why it matters):** https://www.servicenow.com/docs/r/application-development/c_ApplicationScope.html

## 2. Tables & fields (the data model)
*(Guide: Recipe D2 — add/change a field.)*
- **Create a table & add fields (App Engine Studio):** https://www.servicenow.com/docs/bundle/zurich-application-development/page/build/app-engine-studio/task/app-tutorial-create-table.html
- **Altering tables/fields — dictionary attributes:** https://www.servicenow.com/docs/r/xanadu/platform-administration/table-administration-and-data-management/c_DictionaryAttributes.html

## 3. Server-side code — Script Includes & GlideRecord
*(Guide: Recipes D3 & Example 1 — reusable logic; how code reads/writes tables.)*
- **GlideRecord (Scoped) API — reading/writing table rows in code:** https://www.servicenow.com/docs/r/zurich/api-reference/server-api-reference/c_GlideRecordScopedAPI.html
- *(Script Includes are created in Studio; the scoping rules above apply — server-side only.)*

## 4. Workflows — Workflow Studio / Flow Designer (flows, subflows, actions)
*(Guide: Recipes D4/D5 & Examples 3–5 — automations, reusable steps, triggers.)*
- **Workflow Studio (the home for building workflows):** https://www.servicenow.com/docs/r/build-workflows/workflow-studio/workflow-studio.html
- **Create a client-callable flow / subflow / action:** https://www.servicenow.com/docs/bundle/zurich-build-workflows/page/administer/flow-designer/task/grant-access-flow-apis.html

## 5. The screens — Service Portal (widgets & pages)
*(Guide: Recipe D1 & Example 2 — the case screen, boards, dashboards.)*
- **Using portal widgets (what a widget is):** https://www.servicenow.com/docs/bundle/zurich-platform-user-interface/page/build/service-portal/concept/service-portal-widgets.html
- **Create a new widget (step-by-step):** https://www.servicenow.com/docs/bundle/zurich-platform-user-interface/page/build/service-portal/task/create-new-widget.html
- **Creating portal pages:** https://www.servicenow.com/docs/r/platform-user-interface/service-portal/c_Pages.html

## 6. The AI — Now Assist Skill Kit (extraction skills)
*(Guide: Recipe D7 — the AI extraction skills that call Chinou.)*
- **Now Assist Skill Kit (overview):** https://www.servicenow.com/docs/r/intelligent-experiences/now-assist-skill-kit/now-assist-skill-kit-landing.html
- **Create a new skill:** https://www.servicenow.com/docs/r/intelligent-experiences/now-assist-skill-kit/create-new-skill.html
> Note for us: all AI must route through **Chinou** (our approved gateway), not the default "Now LLM."

## 7. Agentic AI — AI Agent Studio (future direction)
*(Discussed as the future "agentic" version.)*
- **AI Agent Studio:** https://www.servicenow.com/docs/r/intelligent-experiences/ai-agent-studio.html
> Note for us: the **native** AI Agents feature is part of **Now Assist** (licensed). Our assessment: an agentic version can also be built directly on Chinou **without** Now Assist.

## 8. Security — Roles & Access Control (ACLs)
*(Guide: Recipe D9 — permissions; our append-only audit rule.)*
- **Access Control List rules (overview):** https://www.servicenow.com/docs/r/platform-security/access-control/access-control-rules.html
- **Create an ACL rule:** https://www.servicenow.com/docs/r/platform-security/access-control/t_CreateAnACLRule.html
- **ACL types (read/write/create/delete, etc.):** https://www.servicenow.com/docs/r/platform-security/access-control/acl-rule-types.html
> Don't change the **audit table's** deny ACLs — they keep the audit trail tamper-proof.

## 9. Promotion & save-points — Update Sets
*(Guide: Part G — saving your work / moving changes.)*
- **Update Set transfers (packaging & moving changes):** https://www.servicenow.com/docs/r/washingtondc/application-development/system-update-sets/update-set-transfers.html
> Note for us: Update Sets move changes **between instances**. With our single-instance Dev/UAT/Prod setup, they're used as **save-points and review packages**; the actual dev→uat→prod movement is handled by the release owner.

## 10. Access for developers — Delegated Development
*(How the Nomura devs get scoped to Dev only.)*
- **Delegated development & deployment:** https://www.servicenow.com/docs/r/application-development/delegated-development-and-deployment/delegated-development-landing.html
> This is how a developer is granted rights to the **Dev app only** (no admin, no prod).

---

## Quick map — "I want to change X → read this"
| I'm changing… | Guide recipe | Official doc |
|---|---|---|
| A screen / widget | D1, Ex 2 | §5 |
| A table / field | D2 | §2 |
| Server logic (Script Include) | D3, Ex 1 | §3 |
| A workflow / subflow | D4, Ex 4/5 | §4 |
| A reusable flow step (action) | D5, Ex 3 | §4 |
| An AI extraction prompt / skill | D7 | §6 |
| Permissions (ACL/role) | D9 | §8 |
| Saving / moving my work | Part G | §9 |

---

*Tip: bookmark **https://www.servicenow.com/docs** and search there for anything not listed. Community articles (community.servicenow.com) and free courses (learning.servicenow.com) are also excellent for hands-on practice.*
