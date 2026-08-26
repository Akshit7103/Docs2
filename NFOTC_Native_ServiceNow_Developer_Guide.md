# NFOTC Developer Guide — for people brand-new to ServiceNow

**Names & Forms — OTC Compare & Match** · Nomura SSG POC
A complete, **beginner-first** guide. It assumes **you have never used ServiceNow before**. Everything is done **inside the ServiceNow website** — no GitHub, no coding tools to install, no "Now SDK." If you can use a web browser and read a little JavaScript, you can follow this.

> **How to read this:** Do **Part A** (what ServiceNow is) and **Part B** (what our app is) once, slowly. Then do **Part C** ("your first change") to get a confidence win. After that, use **Part D** (recipes) and **Part H** (glossary) as look-up references whenever you build something.

---

## The 5 golden rules (read these first, they prevent 90% of mistakes)

1. **Only work in the DEV app.** Its name is **"Names and Forms OTC Dev"**. Everything in it is labelled **"(Dev)"**. The other one ("Names and Forms OTC", no "Dev") is **PROD / live — do not edit it.**
2. **Save = live.** When you click **Save/Update** on a record, your change is **immediately active** in the dev app. There is no separate "deploy" button. So save small changes and check them.
3. **When in doubt, don't delete.** You can almost always edit. Deleting is hard to undo. Ask first.
4. **Take a save-point before risky work** (an "Update Set" — Part G). It lets you undo.
5. **Ask before:** touching anything outside the dev app, changing security/permissions, or anything you don't understand. There are no dumb questions.

---

# PART A — ServiceNow in plain English

### A1. What is ServiceNow?
ServiceNow is a **website-based platform** where companies build internal tools. You use it entirely **in a web browser**. Think of it as a giant, shared database with a website builder, an automation engine, and an AI engine bolted on top — all editable from the browser.

Our app, **NFOTC**, is one tool built on this platform.

### A2. The three ideas you must understand: Table, Record, Field
ServiceNow stores everything in **tables**. A table is just a **spreadsheet**:

- A **table** = a spreadsheet (e.g. "Bank Bookings").
- A **record** = one **row** in that spreadsheet (e.g. one bank booking).
- A **field** = one **column** (e.g. "Amount", "Currency").

When you open a record you see a **form** (all the fields for that one row). When you open a table you see a **list** (all the rows). That's 90% of ServiceNow: lists and forms over tables.

### A3. What is an "Application" and a "Scope"?
An **Application** is a labelled **folder** that groups all the parts of one tool (its tables, its screens, its automations). NFOTC is one application.

A **Scope** is the application's **unique name-prefix** so two apps never clash. Our scopes:
- **PROD:** `x_nose_nfotc`  → app **"Names and Forms OTC"** (live — don't touch)
- **DEV:** `x_nose_nfotc_dev` → app **"Names and Forms OTC Dev"** (yours to build in)

Because of the prefix, the dev "Bank Bookings" table is really called `x_nose_nfotc_dev_booking`, and prod's is `x_nose_nfotc_booking`. Same idea, separate copies.

> **Why two copies?** So you can experiment in **dev** and never break the **live** app. You have permission to edit dev only.

### A4. The building blocks of our app (plain-English definitions)
You'll hear these words constantly. Here's what each **actually is**:

| Term | In plain English | Real-world analogy |
|---|---|---|
| **Table** | a spreadsheet of data | an Excel sheet |
| **Record / Field** | a row / a column | one row / one column |
| **Form** | the screen showing one record's fields | a filled-in paper form |
| **List** | the screen showing many records | the whole spreadsheet |
| **Script Include** | a reusable box of server-side code other parts call | a shared function library |
| **Business Rule** | code that runs automatically when a record is saved | an Excel macro that fires on change |
| **Flow / Subflow** | a **visual** automation (a flowchart of steps) | Zapier / a flowchart |
| **Action** | one reusable step you drop into a Flow | a single Lego brick |
| **Widget** | one reusable piece of a screen (its HTML + style + a little code) | a mini web app / a UI component |
| **Page** | a screen made of one or more widgets | a web page |
| **Portal** | the whole website (a set of pages) with a web address | a website |
| **NASK skill** | a saved AI instruction (a prompt the app can run) | a reusable ChatGPT prompt |
| **ACL** | a permission rule (who may read/write what) | a door lock |
| **Property** | a global on/off or value setting | a settings knob |
| **Update Set** | a package/"save-point" of your changes | a savegame you can restore |
| **Scope** | the app's unique name-prefix | a folder / namespace |

Don't memorize these — refer back. They also appear in the **Glossary (Part H)** with more detail.

### A5. Logging in and finding your way around
1. **Open the site:** `https://nomuraevalinstancegenaipov.service-now.com` and sign in with your ServiceNow account. *(If you don't have one, ask the release owner — you need a login and the dev developer role.)*
2. **The left navigator + filter box:** on the left there's a search box called the **"navigator" / filter**. Type the name of what you want (e.g. `Studio`, or a table name) and it jumps you there. This is how you get *anywhere*.
3. **Lists and forms:** clicking a table opens a **list** (rows). Click a row to open its **form** (fields). Edit a field, click **Save** or **Update** (top-right) — done, it's live.
4. **The scope picker (important):** top-right there's a **gear / settings** icon → **Developer** tab → **Application** dropdown. Set it to **"Names and Forms OTC Dev"**. This tells ServiceNow "I'm working on the dev app now." (Studio, below, sets this for you automatically.)

### A6. Where you'll actually build things — the tools
You don't build in raw lists; you use **builder tools**. Here are the ones you'll use, and **what each is for**:

| Tool | Open it by typing this in the filter | It's for… |
|---|---|---|
| **Studio** | `Studio` | the **main workshop** — one place to see & edit every part of the app (tables, code, screens, flows). **Start here.** |
| **Flow Designer** | `Flow Designer` | building/editing **automations** (flows, subflows, actions) visually |
| **Service Portal Designer** | `Service Portal Configuration` → Designer | arranging **screens** (drag widgets onto pages) |
| **Widget Editor** | (open from Studio) | editing a **widget's** code (the real UI) |
| **Now Assist Skill Kit** | `Now Assist Skill Kit` | creating/editing/turning on **AI skills** |
| **App Engine Studio** | `App Engine Studio` | a friendlier **low-code** view for tables/forms |

**Studio is your home base.** Open it: filter → **Studio** → **Open Application** → **Names and Forms OTC Dev**. You'll see a left tree grouping every file by type. This tree *is* the whole app.

---

# PART B — What NFOTC does (the app you're working on)

### B1. The job, in one sentence
NFOTC reads **settlement emails**, uses **AI to pull out the trade details**, **matches** them against the **bank's own records**, scores how confident it is, and lets a human **analyst confirm** before anything is finalized.

### B2. The pipeline (what happens to one email)
```
1. Email arrives         → dropped into the app
2. Is it relevant?       → the app classifies it (settlement email vs noise)
3. Extract the fields    → AI reads the body/attachment → structured "cashflow" rows
4. Score confidence      → each field marked High / Medium / Low
5. Analyst reviews       → confirms or corrects on the "case screen"
6. Compare & Match       → the cashflow is matched to the bank's booking (golden source)
7. Write-back            → the result is recorded (and, later, sent to the bank systems)
```

Every step is done by a specific part of the app — the map is in **B3**.

### B3. Which part does which step (so you know where to look)

| Step | Done by (native artifact) | Where you'd edit it |
|---|---|---|
| Email dropped in | `Mailbox Drop` table + flow **"Ingest Dropped Email"** | Studio → Tables / Flow Designer |
| Is it relevant? | `WizardExtractor` + the wizard's **id_rules** | Studio → Script Include / Wizard Builder page |
| Extract fields (AI) | Flow **"OTC Settlement - Intake"** → `WizardExtractor` → `GenericFieldExtractor` → a **NASK skill** → **Chinou** (the AI) | Flow Designer / Script Includes / Skill Kit |
| Confidence H/M/L | `ExtractionConfidence` | Studio → Script Include |
| Analyst review screen | the **`ai_extraction`** widget (the "case screen") | Studio → Widget |
| Compare & Match | Flow **"OTC Match & Write-back"** → `CompareMatch` | Flow Designer / Script Include |
| Audit trail | `AuditTrail` (append-only) | Studio → Script Include |

### B4. A few app-specific facts that will confuse you if nobody tells you
- **The "mailbox" is a table, not real email (yet).** You add emails by dropping `.eml` files onto the **"Inbox"** record in the **Mailbox Drop** table. There's no live Outlook connection in this POC.
- **Counterparty is looked up, not AI-extracted** — it comes from the sender's email via a directory table.
- **Direction is flipped to the bank's point of view** on the way in (an email that says "Pay" is stored as "Receive"). And **amounts are never shown negative** (a negative flips the direction again — the "double-flip" rule).
- **Confidence is High/Medium/Low**, never a percentage.
- **Every work-driver (wizard) must have at least one identifying rule**, or it would grab every email.

---

# PART C — Your first change (a safe, guided win)

Do this once to get comfortable. It's harmless and reversible.

**Goal:** change a label you can see on screen, in the dev app.

1. Filter box → type **Studio** → open **"Names and Forms OTC Dev"**.
2. In the left tree, expand **Tables** → click **`Bank Booking (Dev)`**.
3. Click the **Columns** tab (or the table's **Columns** related list). Find the column **`amount`**.
4. Change its **Column label** from "Amount" to "Amount (test)". Click **Save/Update**.
5. Go look: filter → **`x_nose_nfotc_dev_booking.list`** → the "Amount" column header now reads "Amount (test)".
6. **Undo it:** change the label back to "Amount" → Save.

🎉 That's the whole loop: **find the thing → edit → Save (live) → verify → (undo if needed).** Everything else in Part D is just this loop on different artifact types.

> Notice you didn't "deploy" anything. In dev, Save is instant. That's why we work in **dev**, not prod.

---

# PART D — How-to recipes (step-by-step, assume nothing)

Every recipe follows the same shape: **What it is → Where it lives → Steps → How to check.** Do them in the **dev app**.

### D1. Change a screen's text or layout (Service Portal Widget) — the most common task
**What it is:** each screen (the case screen, a board, a dashboard) is a **widget** = a small bundle of **HTML** (the layout), **CSS** (the styling), **Client script** (browser code), and **Server script** (code that fetches data). Editing a screen = editing its widget.
**Where:** Studio → **Service Portal → Widgets** → e.g. **`OTC AI Extraction`** (the analyst case screen).
**Steps:**
1. Open the widget. You'll see tabs/panels: **Body HTML**, **CSS/SCSS**, **Client script**, **Server script**.
2. **HTML** is the layout. Text in `{{ c.data.something }}` means "insert a value the server computed." Plain text you can edit directly.
3. Make a small change (e.g. change a heading). Click **Save**.
4. **Check it:** open the screen in the browser (e.g. `/nfotcdev` → open a case). Refresh.
**Beginner tips:**
- The server script sets values on `data` (e.g. `data.total = 5`). The HTML reads them as `c.data.total`. That's the whole server↔screen link.
- **In this HTML you must write `&amp;&amp;` instead of `&&`, and `&lt;` instead of `<`** (it's XML-strict). If a save "breaks" the layout, check for an unescaped `&&` or `<`.

### D2. Add or change a field on a table (data model)
**What it is:** adding a column to a spreadsheet.
**Where:** Studio → **Data Model → Tables** → the table (e.g. `OTC Cashflow (Dev)`).
**Steps:**
1. Open the table → **Columns** → **New**.
2. Choose **Type** (String = text, Decimal = number, Date/Time, Reference = link to another table).
3. Set **Column label** (what humans see) and **Max length** for text.
4. **Save**. The field now exists everywhere (forms, lists, code, screens).
**Check it:** open any record of that table; the new field shows on the form.

### D3. Write reusable server code (Script Include)
**What it is:** a **shared function library** — code other parts (flows, widgets, business rules) call. Our matching engine (`CompareMatch`) and extractor (`WizardExtractor`) are Script Includes.
**Where:** Studio → **Server Development → Script Include**.
**Read one first:** open **`AmountDirection`** — it's small and shows the pattern.
**Create one:**
1. Studio → **Create Application File → Script Include**.
2. **Name** = the class name (e.g. `MyHelper`). **API Name** auto-fills as `x_nose_nfotc_dev.MyHelper`.
3. Paste this template and edit:
```javascript
var MyHelper = Class.create();
MyHelper.prototype = {
    initialize: function () {},          // runs when you create the object
    greet: function (name) {             // your function
        return 'Hello ' + name;
    },
    type: 'MyHelper'                     // must match the class name
};
```
4. **Save.** Call it from anywhere as: `new x_nose_nfotc_dev.MyHelper().greet('world')`.
**How to test quickly:** filter → **Scripts - Background** (only if you have rights) → run a one-liner and `gs.info(...)` the result. *(If you don't have Background Scripts access, ask — beginners often don't, and that's fine.)*
> **`GlideRecord`** is how ServiceNow reads/writes table rows in code — think "open a spreadsheet in code, loop the rows." You'll see it a lot; there are examples in the existing Script Includes.

### D4. Build/edit an automation (Flow / Subflow)
**What it is:** a **visual flowchart** that runs automatically on some trigger (e.g. "when a cashflow is confirmed, match it"). No heavy coding — you drag steps.
**Where:** **Flow Designer** (filter → Flow Designer).
**Look first:** open **"OTC Match & Write-back"** — this is the flow that matches a confirmed cashflow.
- **Trigger** (top) = what starts it (here: a Cashflow record is updated and marked confirmed).
- **Actions** (below) = the steps it runs in order.
**Create a subflow (a reusable mini-flow):**
1. Flow Designer → **New → Subflow**.
2. Define **Inputs** and **Outputs** (the data in/out).
3. Add **Actions** step by step.
4. **Save**, then **Activate** (a flow does nothing until Activated).
**Beginner tip / known trap:** when a step needs a whole record, pass the **record itself** (as a "reference"), not a single field — passing one field into a typed step often errors.

### D5. Make a reusable step for flows (Flow Action with a script)
**What it is:** an **Action** is one Lego-brick step you can reuse across flows. It can run custom code.
**Where:** **Flow Designer → New → Action**.
**Steps:**
1. Define **Inputs** (e.g. a record, or some text) and **Outputs**.
2. Add a **Script step** → write server JS. Read inputs with `inputs.<name>`, set results with `outputs.<name>`. You can call Script Includes here.
3. **Save → Publish.** Your action now appears in the step-picker when editing any flow.

### D6. Run code automatically when a record is saved (Business Rule)
**What it is:** code that fires when a record on a table is created/updated — like a macro.
**Where:** Studio → **Business Rule** → **New**.
**Steps:** pick the **Table**, choose **When** (before/after/async save), set a **Condition**, write the **script**.
**Beginner trap:** a scoped before/after business rule **cannot call the internet** (no outbound HTTP, including reading Excel files). If you need that, choose **async**, or ask about a background job.

### D7. Edit an AI extraction skill (NASK) + its prompt
**What it is:** a **NASK skill** is a saved AI instruction. Our skill **"Extract Fields Generic Chinou"** takes the email text + an instruction and returns structured data, using **Chinou** (the approved AI).
**Where:** filter → **Now Assist Skill Kit** → set scope to **Names and Forms OTC Dev** → open the skill.
- You'll see its **prompt template**, the **model** ("Chinou · Claude Sonnet 5"), temperature, etc.
- **Turn it on:** Skill Kit → **Activate/Publish** (needed for the Now Assist experience).
**Important:** the *actual wording* the AI uses per field is set in the **Wizard Builder** screen (the "AI Prompt" for each field), not in the skill. The skill is the generic engine; the wizard supplies the specific instruction.
> **Policy:** all AI in this instance must use **Chinou** (never the built-in "Now LLM"). If you create a new AI skill, choose provider **Custom LLM** + model `anthropic-5-sonnet[Bedrock]`.

### D8. Change a setting (Property or Config value)
**What it is:** knobs that change behavior without touching code.
**Two places:**
- **System Properties** (`sys_properties`): e.g. `x_nose_nfotc_dev.noise_domains`. Filter → **System Properties** → search the name → edit **Value** → Save.
- **Config table** `x_nose_nfotc_dev_config` (key/value rows): e.g. matching tolerances, `extraction.engine`. Filter → `x_nose_nfotc_dev_config.list` → open a row → edit → Save.

### D9. Permissions (Roles & ACLs) — read this, edit carefully
**What it is:** **Roles** are labels users have (`analyst`, `manager`). **ACLs** are rules: "to read/write table X you need role Y and condition Z."
**Where:** Studio → **Security → ACL**; roles under **User Administration**.
**Beginner rule:** **don't change ACLs unless you're told to.** In particular, the **audit table's write/delete ACLs deny on purpose** (so the audit trail can never be edited) — leave them.

### D10. Add a new extracted field end-to-end (a worked example)
Say you want the AI to also capture a "Broker" field:
1. **Store it:** add a `broker` column to the cashflow table (D2).
2. **Teach the AI:** in the **Wizard Builder** page, add the field and write its **AI Prompt** (with 2–3 example lines).
3. **Show it:** in the case-screen **widget** (D1), add a row that displays `c.data.broker`.
4. **Try it:** drop a sample email, Sync, open the case — the Broker field should populate.
That's the pattern: **table → prompt → screen → test.**

---

## D11 — FULL worked examples: build each artifact from scratch

Each example below is **complete and buildable exactly as written**, in the **Dev** app. Do them in order to learn each tool. Every one names the tool, the exact values to type, the code/config, and how to verify. Delete them afterward if you like (they're harmless demos).

### ▶ Example 1 — Script Include (reusable code), start to finish
**You'll build:** a helper `HelloNfotc` with a function that turns "Akshit Mahajan" into initials "AM".
1. Filter → **Studio** → open **Names and Forms OTC Dev**.
2. **Create Application File** → search **Script Include** → **Create**.
3. **Name:** `HelloNfotc` · **API Name** auto-fills `x_nose_nfotc_dev.HelloNfotc` · **Accessible from:** *This application scope only* · **Active:** ✓.
4. Replace the **Script** with exactly this, then **Submit/Save**:
```javascript
var HelloNfotc = Class.create();
HelloNfotc.prototype = {
    initialize: function () {},
    initials: function (fullName) {
        var parts = ('' + (fullName || '')).trim().split(/\s+/);
        if (!parts[0]) { return ''; }
        var first = parts[0].charAt(0);
        var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
        return (first + last).toUpperCase();
    },
    type: 'HelloNfotc'
};
```
5. **Verify** (if you have "Scripts - Background" access): filter → **Scripts - Background** → set **In scope** to the Dev app → run:
```javascript
gs.info('Initials = ' + new x_nose_nfotc_dev.HelloNfotc().initials('Akshit Mahajan'));
```
Look for `Initials = AM` in the output. *(No Background Scripts access? That's normal for a new dev — instead call it from the widget in Example 2.)*

### ▶ Example 2 — Service Portal Widget (a screen), start to finish
**You'll build:** a tiny widget that shows how many cashflows exist, and uses the Script Include from Example 1.
1. Studio → **Create Application File** → **Widget** → **Create**.
2. **Name:** `Hello Cashflows (Dev)` · **ID:** `dev-hello-cf` (IDs must be unique across the whole instance — the `dev-` prefix keeps it clear).
3. **Server script** (fetches data — runs on the server):
```javascript
(function () {
    var gr = new GlideRecord('x_nose_nfotc_dev_cashflow');
    gr.query();
    data.count = gr.getRowCount();
    data.who = new x_nose_nfotc_dev.HelloNfotc().initials(gs.getUserDisplayName());
})();
```
4. **Body HTML** (what's shown — reads what the server put on `data`):
```html
<div style="padding:16px;font-family:sans-serif">
  <h3>Hello {{c.data.who}}</h3>
  <p>There are <b>{{c.data.count}}</b> cashflows in the Dev app.</p>
</div>
```
5. **Save.** In the Widget Editor there's a **Preview** — click it. You should see "Hello AM … There are N cashflows."
6. **(Optional) put it on a real page:** filter → **Service Portal → Pages** → **New** → e.g. id `dev_hello` → open it in **Designer** → drag your **Hello Cashflows (Dev)** widget onto it → visit `/nfotcdev?id=dev_hello`.
> This shows the core Service-Portal idea: **server script sets `data.x` → HTML reads `c.data.x`.**

### ▶ Example 3 — Custom Flow Action (a reusable step with code), start to finish
**You'll build:** an action `Uppercase Text (Dev)` that takes text and returns it uppercased — usable in any flow.
1. Filter → **Flow Designer** → top-right **New → Action**.
2. **Action name:** `Uppercase Text (Dev)` · **Application:** Names and Forms OTC Dev.
3. **Inputs** tab → **New** → Label `Text`, name `text`, type **String**.
4. **Outputs** tab → **New** → Label `Result`, name `result`, type **String**.
5. **Action steps** → add a **Script** step → paste:
```javascript
(function execute(inputs, outputs) {
    outputs.result = ('' + inputs.text).toUpperCase();
})(inputs, outputs);
```
6. Map the Script step's output to the action's **Result** output (drag the script result "pill" into Outputs → Result).
7. **Save → Publish.** The action now appears in the step-picker of any flow.
8. **Verify:** use it in Example 4/5, or click **Test** on the action, type "hello", and confirm it returns "HELLO".

### ▶ Example 4 — Subflow (a reusable mini-automation), start to finish
**You'll build:** a subflow `Announce (Dev)` that takes a message, logs it, and reports success — callable from other flows.
1. Flow Designer → **New → Subflow**.
2. **Subflow name:** `Announce (Dev)`.
3. **Inputs** → **New** → Label `Message`, name `message`, type **String**.
4. **Outputs** → **New** → Label `Logged`, name `logged`, type **True/False**.
5. **Add a step** → search the **Log** action → set its message to the **Message** input pill (drag it in).
6. **Set the output:** open the subflow's **Outputs** → set **Logged** = `true` (a constant), or map from a step.
7. **Save → Activate** (a subflow does nothing until Activated).
8. **Verify:** Flow Designer → open the subflow → **Test** → type a message → run → check **System Log** (filter → *System Log → All*) for your message, and that it returns `logged = true`.
> A **subflow** is just a reusable flow you can call from other flows (see Example 5). Inputs/outputs are how data goes in and comes back.

### ▶ Example 5 — Flow (an automation with a trigger), start to finish
**You'll build:** a flow that, whenever a Dev cashflow is confirmed, logs a line and calls your `Announce (Dev)` subflow.
1. Flow Designer → **New → Flow**.
2. **Flow name:** `Log Confirmed Cashflow (Dev)`.
3. **Trigger** → **Record Updated** → **Table:** `OTC Cashflow (Dev)` (`x_nose_nfotc_dev_cashflow`) → **Condition:** `AI Confirmed` `changes to` `true`. *(If you don't see that field, use `Updated` with no condition just to learn — but it'll fire on every edit.)*
4. **Action 1** → **Log** → message: `Confirmed cashflow: ` + drag the trigger record's **Number/Ref** pill.
5. **Action 2** → **Call a Subflow** → pick **Announce (Dev)** → set its **Message** input to `A cashflow was confirmed`.
6. **Save → Activate.**
7. **Verify:** open a Dev cashflow, set it confirmed (or via the case screen), save. Then check **System Log** for both your "Confirmed cashflow…" line and the subflow's message.
> That's the full shape of automation here: **a Trigger** (something happened) → **Actions** (steps, including calling Script Includes or Subflows). Our real **Flow B "OTC Match & Write-back"** is exactly this pattern, just with the matching engine as its action.

**Clean-up (optional):** you can deactivate/delete `Log Confirmed Cashflow (Dev)`, `Announce (Dev)`, `Uppercase Text (Dev)`, `Hello Cashflows (Dev)`, `dev_hello`, and `HelloNfotc` once you've learned from them — they're demos only.

---

### D12 — Client-side behaviour: Client Scripts, UI Policies & calling the server (GlideAjax)
**What it is:** code/rules that run **in the browser on a form** — react when a field changes, or show/hide/require fields.
- **UI Policy** (no code): make a field mandatory / hidden / read-only based on a condition. Studio → **UI Policy** → pick table + condition + actions.
- **Client Script** (code): run on a form's **onLoad / onChange / onSubmit**. Studio → **Client Script**.
- **GlideAjax** (client → server): the browser **cannot** use `GlideRecord`, so to fetch server data from a client script you call a **Script Include marked "Client callable"** via **GlideAjax**.
> **For OUR screens, note the difference:** the NFOTC screens are **Service Portal widgets** (their own **client controller + server script**, see D1) — *not* classic form Client Scripts. Use the widget pattern for our case screen / boards. Client Scripts + UI Policies apply to **standard record forms** (e.g. if you build a form on a table).

### D13 — Integrations: REST Messages & the MID Server
**What it is:** how the app talks to systems **outside** ServiceNow.
- **REST Message** = a saved outbound HTTP call (endpoint + method + auth). Studio → **REST Message**.
- **MID Server** = a small agent installed on the customer's network so ServiceNow can reach **private/internal** systems.
- **In our app:** the connection to **Chinou** is a REST Message routed through a **MID Server** (the `ChinouClient` helper). That's how the AI reaches Nomura's internal gateway.
> **Mostly release-owner/admin territory** — you probably won't add integrations day-to-day. **Two known traps:** (1) a scoped **before/after business rule can't call the internet** — use async; (2) a connection's "Use MID Server" is **ignored in background/flows** — you must pin the MID on the REST Message function (that's why `ChinouClient` exists).

### D14 — Notifications & Scheduled Jobs
- **Notifications** (email/alerts when something happens): Studio → **Notification** (or **System Notification → Email → Notifications**) → choose the table + trigger (record inserted/updated) + condition + who to notify + the message.
- **Scheduled Jobs** (run code on a timer — e.g. nightly): filter → **Scheduled Script Executions** (or Studio → **Scheduled Job**) → set the schedule + the script (which can call your Script Includes).
- **Events** (advanced): fire a named event from code, handle it asynchronously — used for decoupled/background work.

### D15 — Create a NEW Chinou-backed AI skill from scratch *(advanced)*
**What it is:** a new AI instruction (e.g. "summarise this email", "extract a new field") that runs on **Chinou**.
1. Filter → **Now Assist Skill Kit** → scope = **Names and Forms OTC Dev** → **New skill**.
2. **Provider = Custom LLM** (this is Chinou) · **Model** = `anthropic-5-sonnet[Bedrock]` ("Chinou · Claude Sonnet 5"). **Never** pick "Now LLM Generic" (policy).
3. Write the **prompt template** with placeholders, e.g. `INSTRUCTION: {{instruction}}  TEXT: {{content}}  OUTPUT:` and define **inputs** (instruction, content) + **outputs**.
4. **Save → Activate/Publish.**
5. **Call it** from a Script Include via OneExtend — *or*, per our "run without Now Assist" direction, call Chinou directly with `new global.ChinouClient().invoke(prompt)`.
> The **Chinou provider/model** already exists (set up once, instance-side) — you just reuse it for the new skill. Creating that provider is a one-time admin task, not per-skill. Flag this one as advanced; copy the existing "Extract Fields Generic Chinou" skill as your template.

### D16 — BIG worked example: onboard a **new work-driver** end-to-end (mostly no code)
This is the signature NFOTC task — a **manager** configures a new pipeline through the **Wizard Builder**, and it gets its **own board** automatically. No code needed for a standard work-driver.
1. Open the **Manager Dashboard** → **New wizard** (or the **Wizard Builder** page).
2. **Define:** name + the taxonomy (BU → Sub-BU → Service → **Work Driver** → **Activity**). *(Work Driver, name, and Activity are mandatory.)*
3. **Input source:** choose **Mail** → pick a mailbox → set **Email-Identification rules** (keywords / sender / subject that identify *this* driver's emails). **⚠ At least one rule is required**, or it would grab every email.
4. **Fields:** pick the fields to extract; for each, write its **AI Prompt** (with 2–3 grounded examples) and mark **mandatory** where needed.
5. **Target & mapping:** map each extracted field to the target-system field it should populate.
6. **Matching tolerances** (step 5 of the wizard): set amount/value-date tolerances (or leave blank to inherit defaults).
7. **Review** the summary → **Run / validate** on the first email to see a field-by-field result before publishing.
8. **Publish** → **assign** the wizard to one or more analysts.
9. The published wizard now has its **own board** (`/nfotcdev?id=dev_nfotc_wiz_dash&wiz=<id>`); assigned analysts see it on their landing page.
10. Drop matching `.eml` files into the Mailbox Drop → **Sync** → the new driver extracts, matches, and shows cases — using the **same engine**, just your new config.
> This is the "reusable capability, configured per work-driver" model in action: **a whole new pipeline with zero code.** Only add code (D1–D15) when a driver needs behaviour the wizard can't express.

---

# PART E — The AI (Chinou), in plain terms

- **Chinou** is Nomura's approved gateway to the Claude AI. In this app, the AI never talks to the public internet directly — everything routes through Chinou.
- **You normally don't touch the Chinou plumbing.** It's shared instance setup (connections, transformers, a helper called `ChinouClient`, and a MID Server that reaches Nomura's network). If AI extraction fails, first check the **skill is Activated** — the plumbing is almost always fine.
- **The one rule for you:** any new AI you add must use **Chinou** (provider "Custom LLM"), never the built-in Now LLM.

---

# PART F — Conventions & gotchas (save yourself hours)

**Conventions (how the app deliberately behaves):**
- Counterparty is **looked up** from the sender, not AI-extracted.
- Direction is **flipped to the bank's view** on ingest; amounts are **never negative** (double-flip rule).
- Confidence is **High/Medium/Low**.
- Trade IDs look like `FXOPT-2026-00047`.
- Every wizard needs **at least one identifying rule**.

**Gotchas (things that will surprise a beginner):**
- **Save is live** in dev — small steps, verify each.
- In **widget HTML**, write `&amp;&amp;` not `&&`, and `&lt;` not `<`.
- **Screen ids (widget/page/portal) must be unique** across the whole instance — that's why dev screens are prefixed `dev_` and the dev site is `/nfotcdev`.
- **Labels aren't auto-prefixed** — dev things carry a **"(Dev)"** label so you can tell them from prod in search.
- **Scoped before/after business rules can't call the internet** — use async.
- If a screen renders blank after your edit, you probably broke the HTML (an unescaped `&&`/`<`, or a typo) — undo and re-do the change smaller.

---

# PART G — Saving your work & moving it to PROD

- **Work in DEV** (`/nfotcdev`). Test by dropping sample `.eml` files into the dev Mailbox Drop, hitting **Sync**, and walking the case screen.
- **Save-point (undo):** before anything risky, create an **Update Set** (filter → **Update Sets → Local Update Sets → New**). Your changes get recorded in it; you can back it out if needed. *(Ask the release owner how your team uses Update Sets.)*
- **Going to PROD:** prod is a **separate copy** and is off-limits to you. When your dev change is approved, the **release owner** re-creates it in prod. You don't push to prod yourself.
- **Never** run an "uninstall/reinstall" on the app — it can wipe other people's work. Not your job; leave it to the release owner.

---

# PART H — Debugging & troubleshooting (when something breaks)

**The 5 places to look:**
1. **System Log** — filter → **System Log → All** (or **Application Logs**): server errors + anything you print with `gs.info()`. **First place to check for backend issues.**
2. **Browser console** — press **F12 → Console**: widget/screen JavaScript errors. **First place for UI issues.**
3. **Background Scripts** (if you have access) — run a code snippet and see the output; great for testing a Script Include fast.
4. **Script Debugger** (advanced) — set breakpoints and step through server code.
5. **The audit trail** — our append-only audit shows exactly what happened to each cashflow; a built-in debugging aid.

**How to add your own logging:**
- Server code: `gs.info('here: ' + value);` (or `gs.error(...)`) → appears in **System Log**.
- Widget client script: `console.log('here', value);` → appears in the **browser console**.

**Common symptom → likely cause:**
| Symptom | Likely cause |
|---|---|
| Screen goes **blank** after your edit | broken widget HTML — an unescaped `&&`/`<`, or a typo. Undo, redo smaller. |
| **"Sync = 0"** / finds nothing | the `addQuery('field','!=',x)` NULL-exclusion trap, or a work-driver with no id_rule |
| AI extraction **empty/fails** | the NASK skill isn't **Activated**, or the mail genuinely has no parseable data (correct behaviour) |
| A **Save "reverts"** | a permission gate — only the *assigned analyst* can act; check roles/assignment |
| **"Unauthorized"** on an SDK/admin action | login token expired — retry |

---

# PART I — Testing (ATF)

- **What ATF is:** the **Automated Test Framework** — tests that run *inside* the instance (create a record, check a field, click a button, assert the result). Our app already ships **4 ATF tests** (matching, append-only audit, routing, capability chain).
- **Where:** filter → **Automated Test Framework → Tests** (and **Test Suites**).
- **How to run:** enable the property `sn_atf.runner.enabled`; UI tests also open a browser client runner.
- **How to build one:** **New Test** → add **Steps** (e.g. *Insert a record*, *Field values match*, *Run server-side script*) → Save → **Run**.
- **For a POC** it's optional, but it's how you'd prove "the pipeline still works after my change" before promoting anything risky.

---

# PART J — Glossary (every term, plain English)

- **Instance** — our specific ServiceNow website (`nomuraevalinstancegenaipov…`).
- **Application** — a folder grouping all parts of one tool (our app: NFOTC).
- **Scope** — the app's unique name-prefix (`x_nose_nfotc_dev` for dev).
- **Table** — a spreadsheet. **Record** — a row. **Field** — a column.
- **Form** — the screen for one record. **List** — the screen for many records.
- **Script Include** — reusable server-side code (a function library).
- **GlideRecord** — the code way to read/write table rows ("open a spreadsheet in code").
- **Business Rule** — code that runs automatically when a record is saved.
- **Flow / Subflow** — a visual automation (a flowchart). **Action** — one reusable flow step.
- **Widget** — one reusable UI piece (HTML + CSS + client code + server code).
- **Page** — a screen of widgets. **Portal** — the whole website (pages + a URL).
- **NASK skill** — a saved AI prompt the app can run.
- **Chinou** — Nomura's approved AI gateway (to Claude).
- **ACL** — a permission rule. **Role** — a label a user has (analyst/manager).
- **Property** — a global setting. **Config table** — our key/value settings rows.
- **Update Set** — a package/save-point of changes (for undo / moving between instances).
- **MID Server** — a small agent that lets ServiceNow reach Nomura's internal network (needed for Chinou).
- **Studio / Flow Designer / Skill Kit** — the browser tools you build in.
- **Cashflow** — one extracted trade row. **Booking** — a row in the bank's golden source (PCM). **Match** — linking a cashflow to its booking.
- **Client Script** — code that runs in the browser on a record **form** (onLoad/onChange/onSubmit).
- **UI Policy** — a no-code rule that shows/hides/requires form fields based on a condition.
- **GlideAjax** — the way a client (browser) script calls a server Script Include to fetch data.
- **REST Message** — a saved outbound HTTP call to a system outside ServiceNow (our Chinou connection is one).
- **Notification** — an automatic email/alert triggered by a record event.
- **Scheduled Job** — code set to run on a timer (e.g. nightly).
- **Event** — a named signal fired from code and handled asynchronously (decoupled/background work).
- **ATF (Automated Test Framework)** — build-and-run tests inside the instance to check the app still works.
- **OneExtend** — the Now Assist engine that runs a NASK skill (the wrapper around the AI call).

---

# PART K — When you're stuck

1. **Re-read the relevant recipe** in Part D and the term in the **Glossary**.
2. **Look at an existing example** — the app already does what you're trying to do somewhere. Open a similar Script Include / widget / flow and copy the pattern.
3. **Verify against the instance** — if this guide and the screen disagree, the **live record wins** (things evolve).
4. **Ask the release owner** — especially before anything in prod, security, or that you don't understand. That's expected for a new dev.

---

*You do not need to memorize this. Skim it once, then keep it open as a reference while you build. Every real task is the same loop: **find the thing → edit it → Save → check it → undo if needed.**, always in the **Dev** app.*
