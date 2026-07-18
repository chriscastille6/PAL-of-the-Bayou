/**
 * Prerequisite flowcharts (Mermaid) — sync from Advising:
 *   ../Advising/templates/prerequisite_diagram.html  (diagrams object)
 * Arrows: prerequisite → course that requires it (left to right).
 * Regenerate: python3 aol_site/scripts/sync_degree_plan_diagrams_from_advising.py
 *
 * Accounting (acct): ACCT 401/403/407 edges verified vs Nicholls catalog
 * (https://www.nicholls.edu/business/accounting/) — if sync from Advising overwrites, re-check ACCT 323→401, 322→403, 205→407.
 */
window.AOL_DEGREE_PLAN_DIAGRAMS = {
  "cis": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph cis[CIS Core]
        CIS231[CIS 231]
        CIS310[CIS 310]
        CIS320[CIS 320]
        CIS330[CIS 330]
        CIS460[CIS 460 Capstone]
        MNGT368[MNGT 368]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    OIS200 --> CIS231
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    CIS231 --> CIS310
    CIS231 --> CIS320
    CIS231 --> CIS330
    CIS310 --> CIS460
    CIS320 --> CIS460
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "mngh": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph hr[HR Concentration]
        MNGT367[MNGT 367]
        MNGT368[MNGT 368]
        MNGT420[MNGT 420]
        MNGT425[MNGT 425]
        MNGT440[MNGT 440]
        MNGT450[MNGT 450]
        MNGT470[MNGT 470]
        MNGT475[MNGT 475]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    MNGT301 --> MNGT367
    MNGT301 --> MNGT420
    MNGT301 --> MNGT470
    MNGT367 --> MNGT440
    MNGT367 --> MNGT450
    MNGT367 --> MNGT475
    QBA282 --> MNGT425
    QBA283 --> MNGT425
    QBA283 --> MNGT368
    MNGT367 --> MNGT425
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT367 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "mngt": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph mngt[Management Core]
        MNGT368[MNGT 368]
        MNGT370[MNGT 370]
        MNGT420[MNGT 420]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    MNGT301 --> MNGT370
    MNGT301 --> MNGT420
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "mngm": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD221[BSAD 221]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph maritime[Maritime Concentration]
        MNGT330[MNGT 330]
        MNGT368[MNGT 368]
        MNGT410[MNGT 410]
        MNGT465[MNGT 465]
        MNGT470[MNGT 470]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    MNGT301 --> MNGT330
    MNGT301 --> MNGT410
    MNGT301 --> MNGT470
    BSAD221 --> MNGT465
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "mktg": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph mktg[Marketing Core]
        MKTG320[MKTG 320]
        MKTG365[MKTG 365]
        MKTG420[MKTG 420]
        MNGT368[MNGT 368]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    MKTG300 --> MKTG320
    MKTG300 --> MKTG365
    MKTG320 --> MKTG420
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "mkts": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph sales[Professional Sales]
        MKTG320[MKTG 320]
        MKTG350[MKTG 350]
        MKTG365[MKTG 365]
        MKTG420[MKTG 420]
        MKTG480[MKTG 480]
        MNGT368[MNGT 368]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    MKTG300 --> MKTG320
    MKTG300 --> MKTG350
    MKTG300 --> MKTG365
    MKTG320 --> MKTG420
    MKTG350 --> MKTG480
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "mkta": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph adv[Advertising Concentration]
        MKTG320[MKTG 320]
        MKTG365[MKTG 365]
        MKTG420[MKTG 420]
        MKTG450[MKTG 450]
        MKTG475[MKTG 475]
        MKTG481[MKTG 481]
        MNGT368[MNGT 368]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    MKTG300 --> MKTG320
    MKTG300 --> MKTG450
    MKTG300 --> MKTG365
    MKTG320 --> MKTG420
    MKTG450 --> MKTG475
    MKTG450 --> MKTG481
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "acct": `flowchart LR
    %% Catalog (nicholls.edu/business/accounting/): 401 <- 323; 403 <- 322; 407 <- 205 (+ 54 hr rule, not drawn)
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph acct[Accounting Core]
        ACCT321[ACCT 321]
        ACCT322[ACCT 322]
        ACCT323[ACCT 323]
        ACCT351[ACCT 351]
        ACCT401[ACCT 401]
        ACCT403[ACCT 403]
        ACCT407[ACCT 407]
        MNGT368[MNGT 368]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    ACCT205 --> ACCT321
    ACCT321 --> ACCT322
    ACCT322 --> ACCT323
    ACCT206 --> ACCT351
    ACCT323 --> ACCT401
    ACCT322 --> ACCT403
    ACCT205 --> ACCT407
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "finc": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph finc[Finance Core]
        ACCT321[ACCT 321]
        FINC356[FINC 356]
        FINC403[FINC 403]
        FINC405[FINC 405]
        ECON317[ECON 317]
        MNGT368[MNGT 368]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    ACCT205 --> ACCT321
    FINC302 --> FINC356
    FINC302 --> FINC403
    FINC302 --> FINC405
    ECON211 --> ECON317
    ECON212 --> ECON317
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`,
  "bsad": `flowchart LR
    subgraph foundation[Foundation]
        MATH["MATH 100/101"]
        ENGL101[ENGL 101]
    end
    subgraph gened[Gen Ed / Pre-Business]
        ENGL102[ENGL 102]
        MATH106[MATH 106]
        OIS200[OIS 200]
        ACCT205[ACCT 205]
    end
    subgraph bizcore[Business Core]
        ACCT206["ACCT 206/306"]
        ECON211[ECON 211]
        ECON212[ECON 212]
        QBA282[QBA 282]
        QBA283[QBA 283]
        BSAD221[BSAD 221 Legal]
        BSAD310[BSAD 310]
        FINC302[FINC 302]
        MNGT301[MNGT 301]
        MKTG300[MKTG 300]
    end
    subgraph bsad[BSAD Electives / Pre-Law]
        BSAD324[BSAD 324 Commercial Law]
        MNGT368[MNGT 368]
    end
    subgraph capstone[Capstone]
        BSAD490[BSAD 490 Business Policy]
    end
    MATH --> MATH106
    MATH --> OIS200
    MATH --> ACCT205
    ENGL101 --> ENGL102
    ENGL101 --> ECON211
    ENGL102 --> BSAD310
    MATH106 --> QBA282
    MATH106 --> QBA283
    OIS200 --> QBA283
    ACCT205 --> ACCT206
    ACCT206 --> FINC302
    ECON211 --> ECON212
    ECON211 --> FINC302
    QBA282 --> QBA283
    BSAD221 --> BSAD324
    QBA283 --> MNGT368
    FINC302 --> BSAD490
    MKTG300 --> BSAD490
    MNGT301 --> BSAD490
    MNGT368 --> BSAD490
    QBA283 --> BSAD490`
};
