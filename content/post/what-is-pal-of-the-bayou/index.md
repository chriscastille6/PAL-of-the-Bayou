---
title: "Reintroducing the People Analytics Lab (of the Bayou)"
date: 2025-11-04T10:00:00-05:00
lastmod: 2025-11-04T10:00:00-05:00
draft: false
summary: "An introduction to the People Analytics Lab of the Bayou—our vision for engaged scholarship that bridges research with practical impact for organizations and the students we serve."
tags: ["people analytics", "engaged scholarship", "research", "career development"]
categories: ["People Analytics", "Research"]
featured: true

# Featured image
image:
  caption: ""
  focal_point: "Smart"
  preview_only: true
---

<div style="text-align: center; margin: 1rem 0;">
<img src="welcome.jpg" alt="People Analytics Lab of the Bayou" style="max-width: 500px; height: auto; background: transparent;">
</div>

## **Welcome to 'In the Roseaus'**

*"In the Roseaus" is the official blog of the People Analytics Lab of the Bayou.* 

Originally I wanted to call this blog "in the weeds" because some of my own interests lie in areas of HR that are—well—boring as hell to the average reader; so technical that one may wonder why it is even an important topic. For instance, I'm fascinated by how scholars uncover ways in which people work in organizations using quantitative methods. Often, we have to survey people to imperfectly obtain measurements of important concepts (e.g., personality, culture, climates). No doubt there will be some manner of 'error' contaminating the data (no can know 'the truth as god sees it', so to speak) and I'm interested in measuring the errors using advanced statistical approaches (e.g., latent variable modeling techniques) Candidly, the boring details (e.g., how to generate useful data for testing a claim; how to visualize insights so that they are useful to others) are often fun for me; which is partly why I decided to write this blog—I wanted a  way to share what I'm working on with the public. But I also wanted it to reflect my Cajun roots.

Anyone from south Louisiana who comes from a family of hunters will probably know what roseaus are. For the uninitiated, the roseaus are a marsh grass that grows plentifully in the coastal wetlands. I grew up in New Iberia, Louisiana—where Tabasco is made—and regularly hunted with my dad (duck, deer). We used the roseaus to build duck blinds to disguise our presence from the ducks. Often though, the roseaus need to be burned away for ecological reasons. It turns out that burning the marsh helps strengthen it, making it more resistant to erosion and rising seas (<a href="#baurick2018">Baurick, 2018</a>). The fires clear away old growth, fertilize the soil with ash, and allow healthier plants to emerge.

How does burning the marsh relate to my own interest in sharing my work more broadly? As someone interested in boring details in my field's work (I'm an industrial-organizational psychologist by training), I often stumble open facts that should be questioned or burned away. One that is a figurative piñata for my field (one beloved by business school scholars and IO psychology practitioners alike) is using Myers-Briggs personality testing (or random variations like 'which Harry Potter House' are you from) to help students and professionals learn ways to navigate interpersonal challenges. Indeed, roughly 1/3 of HR professionals believe this (<a href="#fisher2021">Fisher et al., 2021</a>). It turns out that roughly half of the people who take such type tests change their type over repeat assessments (<a href="#pittenger2005">Pittenger, 2005</a>). That reveals two things: (1) the types tested for by the MBTI are not stable over time; and (2) the types tested for by the MBTI are going to be very noisey predictors of workplace behavior. Interestingly, this reveals something about personality, it has both stable and state-like aspects. Learning to work with both the stable and dynamic features of someone's personality is something that may yet be worth appreciating in practice.

Like old grass that must be burned away to make for a more fertile foundations for new growth, practices like personality-type testing should be discarded in-favor of evidence-based practices. Clearing away what's not working—old growth that chokes out healthier plants, assumptions that don't hold up under scrutiny, methods that seem solid until you actually test them-all of this should be normative. With this blog, I want to serve a role that helps scholars and practitioners focus more effort and attention toward practices may be more helpful though not necessarily wide-spread. I'll dive deep into specific organizational practices, analytical techniques, and practical applications that advance theory. I'll showcase my points with evidence from the scholarly litrature, reproducible analyses, and do my best to clearly explain my reasons for adopting new tactics and abandoning old ones. I'll share both successes and failures, because that's how science progresses. Just like a marsh needs periodic burns to stay healthy, the organizational thinking that I will throw matches on will-I believe-thrive because it is being questioned. Some posts will be technical. Others conceptual. All will aim to illuminate something interesting about people at work—patterns in personality data, effects of compensation structures, nuances of statistical methods, insights from organizational networks. If that sounds interesting to you, then [subscribe to stay updated](/post/).

## **What is the PAL of the Bayou and Why am I 'Re-interoducing' it?**

I started the PAL in 2017 when I arrived as an Assistant Professor of Management at Nicholls State University. Previously, I worked as a Professor of Practice in the Rutgers School of Business (2016-2017) and before that I worked as a Visiting Assistant Professor of Psychology at Villanova University (2014-2016)...and before that, I was completing my PhD in Industrial-Organizational Psychology at Louisiana Tech University. In addition, to my studies, I worked in a student-run consulting named **Applied Research for Organizational Solutions (AROS)** where I was trained to be an in-house consultant on HR-related matters. In doing that work, I discovered a love of figuring out how people function in organizational settings - finding ways to share what I learned with others became a passion of mine; hence why I pursued a career in academia and, ultimately, started the PAL. My hope was to inspire them to assist me in executing my research program and help these students find graduate student opportunities elsewhere. 

Unfortunately, this proved easier said than done. Starting a family, navigating COVID, and getting my research program more well-established while mentoring students was not easy to do all at once...but I really enjoy mentoring students, making my science open and transparent, and want to do more of that; hence why I'm 're-introducing' the PAL of the Bayou: my personal website to share my work with interested students and members of our community. My goal is to be viewed as an engaged scholar in south Louisiana; be it through sharing my work more broadly or simply putting students of mine who appreciate my discipline's science in touch with local professionals (<a href="#hoffman2021">Hoffman, 2021</a>). I try to do work that falls into what scholars term Pasteur's Quadrant—research that is concerned with advancing both theory and practice (<a href="#stokes1997">Stokes, 1997</a>).. I strive to avoid dismissing theory (however esoteric it may be)—as is often done in practice—because doing so can cause us to miss important insights that only well-articulated theory can illuminate. Conversely, I try to avoid dismissing the observations of practitioners (e.g., HR professionals) while recognizing their limitations. As evidence-based management research shows, practitioner evidence is often the most biased source of evidence (<a href="#briner">Briner, 2019</a>); that said, their observations never fail to generate new ideas to be tested. 

With the PAL, I'm committed to practicing **open science**. Open science refers to research practices that enhance the rigor and trustworthiness of our science through transparency, reproducibility, and accessibility (<a href="#castille2022">Castille et al., 2022</a>). In my science, there are certain core values that are widely shared-objectivity, honesty, openness, accountability, fairness, and stewardship. By taking steps such as sharing code, summary statistics, visualizations, and data (where it is safe to do so), I can help others trust the knowledgebase upon which we impact practice. Indeed, I believe that AI can help us to implement open science practices by making verifications and reproductions of existing works more feasible (note the code in the case studies below). But there's a challenge: simply translating science into practice. As fellow industrial-organizational psychologist Rick Guzzo and I (<a href="#guzzo2024">2024</a>) discussed, translational science—the process of moving research from discovery to application—needs to be accelerated. We need to avoid the ~15 year time lags between science and practice that often plague medicine, where it can take decades before evidence changes practice. 

That's why I'm partnering with <a href="https://www.bayoushrm.org">Bayou SHRM</a> to build a mentoring program that helps our top HR students receive mentoring from experienced, local professionals—and both learn about how to best apply what are commonly studied as high-performance work practices (<a href="#combs2006">Combs, Liu, Hall, & Ketchen, 2006</a>). These practices—which include selective hiring, extensive training, performance-based pay, and employee involvement—have been shown to improve organizational performance. Indeed, recent meta-analytic evidence indicates that high-performance work practices are effective in small to medium enterprises, who make up the bulk of our local organizations (<a href="#hansen2025">Hansen, Usanova, & Geraudel, 2025</a>). 









## **What is People Analytics?**

People analytics applies data science, statistical methods, and behavioral science to understand and improve how organizations manage their workforce. This field requires diverse competencies. A study of job postings for people analysts and HR analysts revealed six core competency areas (<a href="#mccartney2021">McCartney, Murphy, & Mccarthy, 2021</a>): consulting, technical knowledge, data fluency and data analysis, HR and business acumen, research and discovery, and storytelling and communication. As McCartney et al. note, these competencies reflect the evolving role of HR analysts who must blend technical expertise with business insight and communication skills.

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin: 2rem auto; max-width: 900px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 12px; color: white; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">💻</div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: bold;">Technical Knowledge</h3>
    <p style="font-size: 0.85rem; margin: 0; opacity: 0.9;">Proficiency in technological systems relevant to HR analytics</p>
  </div>
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 1.5rem; border-radius: 12px; color: white; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🤝</div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: bold;">Consulting</h3>
    <p style="font-size: 0.85rem; margin: 0; opacity: 0.9;">The ability to add value to stakeholders through effective consulting practices</p>
  </div>
  <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 1.5rem; border-radius: 12px; color: white; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: bold;">Data Fluency and Data Analysis</h3>
    <p style="font-size: 0.85rem; margin: 0; opacity: 0.9;">Skills in understanding and analyzing data to derive meaningful insights</p>
  </div>
  <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); padding: 1.5rem; border-radius: 12px; color: white; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📖</div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: bold;">Storytelling and Communication</h3>
    <p style="font-size: 0.85rem; margin: 0; opacity: 0.9;">The ability to effectively communicate findings and insights through compelling narratives</p>
  </div>
  <div style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); padding: 1.5rem; border-radius: 12px; color: white; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">💼</div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: bold;">HR and Business Acumen</h3>
    <p style="font-size: 0.85rem; margin: 0; opacity: 0.9;">A comprehensive understanding of human resources and business operations</p>
  </div>
  <div style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); padding: 1.5rem; border-radius: 12px; color: #333; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔬</div>
    <h3 style="margin: 0.5rem 0; font-size: 1.1rem; font-weight: bold;">Research and Discovery</h3>
    <p style="font-size: 0.85rem; margin: 0; opacity: 0.8;">Competence in conducting research to uncover new information and trends</p>
  </div>
</div>

In my view, people analytics is partly a broader, more encompassing (and pluralistic) view of HR analytics. It likely involves traditional I-O psychology applied research (e.g., identifying local effects that can be capitalized upon to deliver value to the firm) and as such is concerned with operational reporting, measuring and managing talent, and monitoring investments in the workforce to determine where and how value is being delivered. To make this point more salient, consider this chart showing Google search interest for five HR-related terms from 2004 to 2025. Notice how "people analytics" has dramatically outpaced "HR analytics" since around 2015. This isn't just semantic preference. It reflects a fundamental shift—from administrative HR functions to strategic, people-centered analytics. From compliance and record-keeping to prediction and optimization. From intuition to evidence. The field has grown remarkably over the past two decades. What began as basic workforce reporting has evolved into sophisticated predictive modeling, experimental design, and organizational network analysis.

<div style="margin: 2rem 0; text-align: center;">
{{< figure src="featured.png" width="120%" caption="Figure 1. Google search interest for five HR-related terms from 2004 to 2025. Notice how 'people analytics' has dramatically outpaced 'HR analytics' since around 2015. Adapted from van der Laken (2021)." >}}
</div>

<details style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">
  <summary style="cursor: pointer; font-weight: 600; color: #2563eb; user-select: none;">📊 View code to generate Figure 1</summary>
  <pre style="margin-top: 1rem; padding: 1rem; background: #ffffff; border-radius: 4px; overflow-x: auto; font-size: 0.85rem; line-height: 1.5;"><code>{{< readfile file="content/post/what-is-pal-of-the-bayou/generate_google_trends_figure.R" >}}</code></pre>
</details>

But here's an important distinction: people analytics and evidence-based management are not the same thing. As <a href="#briner">Briner (2019)</a> has noted, people analytics is one piece of taking an evidence-based approach—but not the only piece. People analytics encompasses the full spectrum of bringing evidence into organizational decision-making, integrating operational planning, research-based insights, consulting skills, and data science. Not all sets of data need to be gathered or generated, and not all analyses on one's available data need to be conducted to make progress. Rather, the two inform each other. When analysts are conscientious, explicit, and judicious in their use of the best available evidence from multiple sources to make decisions, they are practicing evidence-based management (<a href="#briner">Briner, 2019</a>). Sometimes that comes from our own organization's data. Other times it comes from other sources—published research, industry benchmarks, or insights from similar organizations. To make this point more salient, let's consider an interesting and widespread problem: why do people quit?

## **An Example of The Kinds of Problems People Analysts Address: Employee Turnover**

Turnover—when employees leave an organization—is one of the most costly and disruptive problems organizations face. The financial implications are substantial: research has documented that the cost of employee turnover can range from 1–2x an employee's annual salary, depending on the role and industry ([Boudreau, Cascio, & Fink, 2019](#boudreau2019)). But turnover isn't just expensive. It disrupts teams, erodes institutional knowledge, and can create cascading effects throughout an organization.

Meta-analytic research has identified various predictors of turnover, from job satisfaction and organizational commitment to job search behavior and alternative job opportunities ([Griffeth, Hom, & Gaertner, 2000](#griffeth2000); [Hom, Mitchell, Lee, & Griffeth, 2012](#hom2012)). Research published in the *Journal of Business and Psychology* has examined the trustworthiness of turnover research, helping us understand which findings we can rely on and which require more careful interpretation ([Field, Bosco, & Kepes, 2021](#field2021)). Some of these factors relate to content that I find particularly interesting—personality and individual differences. For example, conscientiousness and emotional stability are consistently related to turnover intentions, while other traits like openness to experience may predict different types of career moves ([Zimmerman, 2008](#zimmerman2008)). If our goal is to control turnover costs, then looking at salient factors that are controllable from an organizational perspective are worth considering—fit for the role, leadership quality, compensation structures, and work-life balance.

But there's another factor worth considering: do people sometimes quit because their coworkers quit? This is what's commonly referred to as "turnover contagion." When a coworker leaves, does it increase your own likelihood of leaving? Research suggests yes—and the effect can be cumulative ([Felps et al., 2009](https://doi.org/10.5465/amj.2009.41331075); [Wang, Newman, & Dipboye, 2016](https://doi.org/10.5465/ambpp.2016.82)). When multiple coworkers in your network leave, your turnover risk increases substantially. The idea is simply that when one's network sustains more losses, they will naturally start thinking about leaving themselves. It's easier to find a job in other companies and easier to 'get started,' presumably, if they have close contacts at another company. Surely some of this can represent homophily (i.e., natural trends within an occupation) and more creative research is needed to tease apart these distinct causal influences.

This is where **organizational network analysis (ONA)**—the study of how relationships and connections within an organization influence behavior and outcomes—becomes powerful. In research led by my colleague Scott Hines—a former Louisiana Tech Bulldog, then at Allstate Insurance Company, now Senior Research Scientist at Amazon Web Services—he collected and examined organizational network data from over 5,000 employees ([Hines, Castille, & Castille, 2019](#hines2019)). I helped him work toward publication of this research. He mapped each employee's connections within the organization, then tracked how coworker departures influenced their own turnover decisions. An important methodological challenge in this work was distinguishing turnover contagion from homophily—the tendency for similar people to associate with each other (birds of a feather flock together). Indeed, our data could not fully differentiate these two influences, which in part explains why this paper wasn't published. While we strive to make everything open and accessible, this must be done within reason—we don't want to place anyone at risk by sharing information that could be identifying or harmful.

The results were striking: the odds of an employee turning over increase by approximately 2.1x for every connection that has left, and the effect compounds dramatically—losing multiple connections created cascading turnover risks that could destabilize entire teams or departments.

<div style="margin: 2rem 0; text-align: center;">
  {{< figure src="turnover-contagion-bars-figure1.png" caption="Figure 2. Compounding turnover probabilities. The odds of an employee turning over increase by approximately 2.1x for every connection that has left. Employees with no departing connections have a baseline risk (1x), while those with 1, 2, 3, 4, or 5 connections who have left face 1.7x, 3.3x, 5.0x, 6.6x, and 8.3x increases in turnover probability, respectively." >}}
</div>

<details style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px; border: 1px solid #dee2e6;">
  <summary style="cursor: pointer; font-weight: 600; color: #2563eb; user-select: none;">📊 View code to generate Figure 2</summary>
  <pre style="margin-top: 1rem; padding: 1rem; background: #ffffff; border-radius: 4px; overflow-x: auto; font-size: 0.85rem; line-height: 1.5;"><code>{{< readfile file="content/post/what-is-pal-of-the-bayou/generate_turnover_contagion_figure.R" >}}</code></pre>
</details>

<div class="row" style="margin: 1.5rem 0; align-items: center;">
  <div class="col-lg-6">
    <p>This network view illustrates the interconnected nature of turnover decisions. Employees don't leave in isolation—their departures send ripples through their social networks.</p>
    <p>The network reveals how turnover can spread through social ties, with central employees having greater influence on contagion effects. When turnover spreads through networks, these costs multiply rapidly.</p>
  </div>
  <div class="col-lg-6">
    {{< figure src="turnover-contagion-network.gif" caption="Figure 3. Network visualization of turnover contagion. This view illustrates how turnover can spread through social ties, with central employees having greater influence on contagion effects." >}}
  </div>
</div>

The network reveals how turnover can spread through social ties, with central employees having greater influence on contagion effects. When turnover spreads through networks, these costs multiply rapidly. Organizations can use network analysis to identify employees at high risk of turnover contagion and intervene proactively—perhaps through targeted retention efforts, team restructuring, or addressing underlying issues that drive departures.

This is the kind of problem we work with at PAL. Not abstract theoretical questions, but real challenges that organizations face every day. Where I can be helpful is in helping a team consider a more holistic perspective. Sometimes you have the data you need to answer a question. Sometimes you don't. The key is knowing when to gather new data, when to analyze existing data, and when to draw on what the broader research literature tells us. It's about bringing the right tools—whether that's network analysis, predictive modeling, experimental design, or meta-analytic insights—to bear on problems that matter.

I'm unapologetic about using AI to swiftly turn ideas into testable realities. This blog post, the website, and most of the materials available here were drafted with assistance from Cursor AI. AI can help us in multiple ways: by quickly synthesizing research findings, identifying relevant studies, and helping analysts navigate the vast literature to find the most applicable evidence for their specific organizational context; by facilitating the use of our own intellect, as <a href="#mollick2024">Mollick (2024)</a> discusses in *Co-intelligence*; and by getting through the drudgery of work—getting code to run, getting output that should make sense, having a process that is auditable. This is what it means to use AI as what Mollick calls "co-intelligence"—not replacing our thinking, but augmenting it. The tools we use—whether AI-assisted code generation, automated data analysis, or intelligent research assistants—are means to an end: better science, faster iteration, and more accessible insights. AI can help us be wrong faster, and what is learning if not being wrong? We can experiment, get feedback, and improve over time. AI can be used thoughtfully or thoughtlessly, but when used thoughtfully, it accelerates our ability to iterate, test hypotheses, and refine our understanding. What matters isn't the tool, but the rigor of the methods, the validity of the findings, and the impact on practice.

## **PAL's Three Research Themes**

PAL pursues three interconnected research streams, each designed to advance both science and practice:

<div class="row" style="margin: 1.5rem 0;">
  <div class="col-lg-4">
    <h3 style="font-weight: bold; color: #2c3e50; margin-bottom: 0.75rem;">Personality and Individual Differences at Work (PAID @ Work)</h3>
    <p>We study how individual characteristics—personality traits, values, abilities—shape workplace behavior and outcomes. This includes examining both the "bright side" (conscientiousness, meaningful work, occupational fit) and the "dark side" (Machiavellianism, unethical behavior) of personality at work (<a href="https://doi.org/10.1007/s10551-016-3079-9">Castille, Buckner, & Thoroughgood, 2018</a>; <a href="https://doi.org/10.1016/j.paid.2019.109569">Simonet & Castille, 2020</a>).</p>
    <p>We're adapting occupational fit tests to help students discover educational and career opportunities unique to South Louisiana.</p>
    <p>We're also developing an emotional intelligence assessment to help college students build strengths across different facets of emotional intelligence, drawing on established frameworks from Mayer and Salovey's four-branch model and ability-based measures of workplace emotional intelligence (<a href="https://doi.org/10.1037/apl0000365">Schlegel & Mortillaro, 2019</a>).</p>
  </div>
  <div class="col-lg-4">
    <h3 style="font-weight: bold; color: #2c3e50; margin-bottom: 0.75rem;">Organizational Research Methods</h3>
    <p>We develop and validate better approaches to organizational research, including open science practices that increase transparency and reproducibility, and techniques for understanding and controlling method variance (<a href="https://doi.org/10.1108/S0742-730120240000042005">Castille & Williams, 2024</a>; <a href="https://doi.org/10.1007/s10869-022-09806-2">Castille et al., 2022</a>). Better methods yield better science, which yields better practice.</p>
    <p>We use simulation methods to understand how people respond to surveys and under what conditions we can trust the findings emerging from our research. This work, conducted with <a href="#williams2024">Larry Williams</a>, helps us understand when survey responses are reliable and when they might be compromised by various response biases or methodological artifacts. Simulation also augments my teaching practice—I've built simulations to help students use effective performance management practices, and I've co-taught with colleagues in other departments using total rewards optimization exercises that help students see how economic concepts apply to management challenges, such as employee retention.</p>
    <p>I'm co-founder and executive team member of the <a href="https://www.arimweb.org">Advancement of Replications Initiative in Management (ARIM)</a>, leading <a href="https://www.arimweb.org/replications-initiative/s1-the-dark-side-of-goal-setting">Project 1—The Dark Side of Goal Setting</a>—a global study examining whether goals cause individuals to engage in unethical behaviors. Our team of international scholars is investigating this question through exact and constructive replications of <a href="https://doi.org/10.5465/20159596">Schweitzer, Ordóñez, & Douma (2004)</a>. This work exemplifies what <a href="#kreamer2024">Kreamer, Cobb, Castille, & Cogswell (2024)</a> describe as big team science initiatives—collaborative efforts that facilitate large sample theory testing, resource sharing, and trustworthy scientific advancement.</p>
  </div>
  <div class="col-lg-4">
    <h3 style="font-weight: bold; color: #2c3e50; margin-bottom: 0.75rem;">People Strategy and Tactics</h3>
    <p>We apply analytics to real-world HR challenges: attrition modeling, compensation strategy, high-performance work practices, and demonstrating return on investment (ROI) through utility analysis. This is where theory meets practice, where models become tools, where research creates impact. We draw on foundational work in utility analysis, including <a href="#sturman2001">Sturman's (2001)</a> advances in calculating the value of selection procedures and HR interventions, as well as his <a href="#sturman2003">2003</a> work on quantifying the value of HR interventions.</p>
    <p>Importantly, <a href="#sturman2012">Sturman (2012)</a> called for more attention to be devoted to teaching utility analysis—recognizing that while the method is powerful, it needs to be more accessible to students and HR professionals. This is something I've taken upon myself to do. I'm creating an open-source human resource information system (HRIS) for students to practice interacting with and using HR data to drive organizational decision-making and execute strategy. I'm also working to make utility analysis more accessible through several web applications developed based on scholars' published works:</p>
    <ul style="font-size: 0.9rem;">
      <li><a href="https://christopher-m-castille.shinyapps.io/staffing-utility-analysis/">Comprehensive Staffing Utility Analysis</a> - Complete staffing utility analysis tool</li>
      <li><a href="https://christopher-m-castille.shinyapps.io/training-utility-analysis/">Training Utility Analysis</a> - Calculate ROI of training programs</li>
      <li><a href="https://christopher-m-castille.shinyapps.io/sturman-2003-performance-pay-analysis/">Sturman (2003) Performance-Pay Analysis</a> - Analyze performance-based pay systems</li>
      <li><a href="https://christopher-m-castille.shinyapps.io/fisher-connelly-2017-contingent-workers/">Fisher & Connelly (2017) Contingent Workers Analysis</a> - Evaluate contingent worker programs</li>
    </ul>
  </div>
</div>

## **For Our Students**

If you're a student at Nicholls State University—or anywhere else—considering a career in people analytics, here's what you need to know.

Want to assess whether this career path aligns with your preferences? Try our [People Analytics Fit Assessment](/assessments/people-analytics-fit/)—a comprehensive assessment based on [Liu et al. (2024)](https://doi.org/10.1037/apl0001232) that measures your fit across interests, values, knowledge, skills, and personality. This assessment is specifically designed for college students interested in People Analytics careers and provides detailed feedback on how your profile relates to different career outcomes (career satisfaction, job satisfaction, income potential, etc.).

There's a wonderful video of James Randi talking about what happens when people get a PhD. The humor comes from recognizing how advanced degrees can sometimes inflate our sense of certainty—when in reality, we should be more humble about what we know and don't know. This isn't just a joke; it's a profound truth about the scientific process.

Science advances not through certainty, but through debate, argument, and ideally, consensus. <a href="#latham1988">Latham, Erez, & Locke (1988)</a> demonstrated this beautifully when they resolved a scientific dispute by the joint design of crucial experiments by the antagonists. Rather than continuing to argue from entrenched positions, they worked together to design studies that could actually answer their questions. That's how science should work—not as a battle of egos, but as a collaborative search for truth.

This humility is essential for effective people analytics and change management. No change effort is perfect. No analysis is flawless. No intervention works exactly as planned. Embracing imperfection—recognizing that we'll make mistakes, that our models will be wrong, that our predictions will miss the mark—isn't a weakness. It's a strength. It's what allows us to learn, to iterate, to improve.

What is learning if not being wrong? AI can help us be wrong faster. I believe we can accelerate science with AI, and I'm not alone in this view (<a href="#science2024">Thorp & Zewail, 2024</a>; <a href="#banks2025">Van Quaquebeke, Tonidandel, & Banks, 2025</a>). Rather than seeing AI as a threat to scientific rigor, we should recognize it as a tool that can help us iterate more quickly, test hypotheses more efficiently, and learn from our mistakes more rapidly. As <a href="#banks2025">Van Quaquebeke, Tonidandel, & Banks (2025)</a> discuss, AI will reshape scientific inquiry and the publication process—not just by making things more efficient, but by fundamentally changing how we approach research questions and scientific communication. When learning to dance, you don't read a book and then hit a perfect move on the first try. You experiment. You get feedback. You improve over time. I know this from experience—I used to perform with The Cadets, a world championship organization. We won in 2005, and I led the organization from 2006 to 2008. I can appreciate the value of learning and having teachers who help you learn. The same principle applies to using AI thoughtfully—it requires practice, feedback, and continuous improvement.

## **Partner with Us**

Whether you're a student exploring career options, an HR professional building analytics capabilities, an organizational leader seeking evidence-based insights, or simply someone curious about what data reveals about people at work—welcome.

This is an academic project, yes. But it's academic work in service of real problems, real organizations, and real people. It's scholarship that engages with the world rather than retreating from it.

That's the vision for the People Analytics Lab of the Bayou.

Stay tuned as we share our research, develop new tools, and explore what it means to study people in organizational life with rigor, humility, and a commitment to making work better.

<div style="margin: 2rem 0; padding: 1.5rem; background: #f8f9fa; border-radius: 8px; text-align: center;">
  <h4 style="margin-bottom: 1rem; color: #2c3e50;">Share this post</h4>
  <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
    <a href="https://twitter.com/intent/tweet?url=https://bayoupal.netlify.app/post/what-is-pal-of-the-bayou/&text=What%20is%20the%20People%20Analytics%20Lab%20(PAL)%20of%20the%20Bayou?" 
       target="_blank" 
       rel="noopener noreferrer"
       style="padding: 0.5rem 1rem; background: #1DA1F2; color: white; text-decoration: none; border-radius: 5px; font-weight: 500;">
      <i class="fab fa-twitter" aria-hidden="true"></i> Twitter/X
    </a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://bayoupal.netlify.app/post/what-is-pal-of-the-bayou/" 
       target="_blank" 
       rel="noopener noreferrer"
       style="padding: 0.5rem 1rem; background: #0077B5; color: white; text-decoration: none; border-radius: 5px; font-weight: 500;">
      <i class="fab fa-linkedin" aria-hidden="true"></i> LinkedIn
    </a>
    <a href="https://www.facebook.com/sharer/sharer.php?u=https://bayoupal.netlify.app/post/what-is-pal-of-the-bayou/" 
       target="_blank" 
       rel="noopener noreferrer"
       style="padding: 0.5rem 1rem; background: #1877F2; color: white; text-decoration: none; border-radius: 5px; font-weight: 500;">
      <i class="fab fa-facebook" aria-hidden="true"></i> Facebook
    </a>
    <a href="mailto:?subject=What%20is%20the%20People%20Analytics%20Lab%20(PAL)%20of%20the%20Bayou?&body=https://bayoupal.netlify.app/post/what-is-pal-of-the-bayou/" 
       style="padding: 0.5rem 1rem; background: #6c757d; color: white; text-decoration: none; border-radius: 5px; font-weight: 500;">
      <i class="fas fa-envelope" aria-hidden="true"></i> Email
    </a>
  </div>
</div>

---

## **Comments & Discussion**

<form name="blog-comments" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
  <!-- Hidden field for Netlify bot protection -->
  <div style="display: none;">
    <input name="bot-field" />
  </div>
  
  <!-- Hidden field to identify which post -->
  <input type="hidden" name="post" value="what-is-pal-of-the-bayou" />
  
  <div style="margin-bottom: 1.5rem;">
    <label for="name" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50;">Name *</label>
    <input type="text" id="name" name="name" required 
           style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit;" />
  </div>
  
  <div style="margin-bottom: 1.5rem;">
    <label for="email" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50;">Email *</label>
    <input type="email" id="email" name="email" required 
           style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit;" />
    <p style="font-size: 0.85rem; color: #6c757d; margin-top: 0.25rem;">Your email will not be published.</p>
  </div>
  
  <div style="margin-bottom: 1.5rem;">
    <label for="comment" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50;">Comment *</label>
    <textarea id="comment" name="comment" rows="6" required 
              style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; font-family: inherit; resize: vertical;"></textarea>
  </div>
  
  <button type="submit" 
          style="padding: 0.75rem 2rem; background: #2563eb; color: white; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s;">
    Submit Comment
  </button>
</form>

<p style="font-size: 0.85rem; color: #6c757d; margin-top: 1.5rem; margin-bottom: 0;">
  <strong>Note:</strong> Comments are moderated and may take some time to appear. We welcome thoughtful discussion and diverse perspectives.
</p>

---

## **References**

<a id="baurick2018"></a>Baurick, T. (2018, December 15). Coastal News Roundup: Burning The Marsh To Strengthen The Coast. *WWNO - New Orleans Public Radio*. https://www.wwno.org/coastal-desk/2018-12-15/coastal-news-roundup-burning-the-marsh-to-strengthen-the-coast

<a id="banks2025"></a>Van Quaquebeke, N., Tonidandel, S., & Banks, G. C. (2025). Beyond efficiency: How artificial intelligence (AI) will reshape scientific inquiry and the publication process. *The Leadership Quarterly*, *36*(4), 101895. [https://doi.org/10.1016/j.leaqua.2025.101895](https://doi.org/10.1016/j.leaqua.2025.101895)

<a id="briner"></a>Briner, R. B. (2019). *The basics of evidence-based practice*. Chartered Institute of Personnel and Development. [https://www.cipd.org/uk/knowledge/reports/evidence-based-hr/](https://www.cipd.org/uk/knowledge/reports/evidence-based-hr/)

<a id="boudreau2019"></a>Boudreau, J. W., Cascio, W. F., & Fink, A. A. (2019). *Investing in People: Financial Impact of Human Resource Initiatives* (3rd ed.). Society for Human Resource Management.

<a id="castille2018"></a>Castille, C. M., Buckner, J. E., & Thoroughgood, C. N. (2018). Prosocial citizens without a moral compass? Examining the relationship between Machiavellianism and unethical pro-organizational behavior. *Journal of Business Ethics*, *149*(4), 919-930. [https://doi.org/10.1007/s10551-016-3079-9](https://doi.org/10.1007/s10551-016-3079-9)

<a id="castille2022"></a>Castille, C. M., Kreamer, L. M., Albritton, B. H., Banks, G. C., & Rogelberg, S. G. (2022). The open science challenge: Adopt one practice that enacts widely shared values. *Journal of Business and Psychology*, *37*(3), 567-580. [https://doi.org/10.1007/s10869-022-09806-2](https://doi.org/10.1007/s10869-022-09806-2)

<a id="castille2024"></a>Castille, C. M., & Williams, L. J. (2024). Shedding light on invisible influences: Reviewing HROB scholars' use of unmeasured latent method factors. In *Research in Personnel and Human Resources Management* (Vol. 42, pp. 139-188). Emerald Publishing Limited. [https://doi.org/10.1108/S0742-730120240000042005](https://doi.org/10.1108/S0742-730120240000042005)

<a id="combs2006"></a>Combs, J., Liu, Y., Hall, A., & Ketchen, D. (2006). How much do high-performance work practices matter? A meta-analysis of their effects on organizational performance. *Personnel Psychology*, *59*(3), 501-528. [https://doi.org/10.1111/j.1744-6570.2006.00045.x](https://doi.org/10.1111/j.1744-6570.2006.00045.x)

<a id="hansen2025"></a>Hansen, C., Usanova, K., & Geraudel, M. (2025). A meta-analysis on the effects of high-performance work practices in small and medium-sized enterprises: An exploration of organizational- and individual-level outcomes. *Journal of Business Venturing Insights*, *24*, e00572. [https://doi.org/10.1016/j.jbvi.2025.e00572](https://doi.org/10.1016/j.jbvi.2025.e00572)

<a id="felps2009"></a>Felps, W., Mitchell, T. R., Hekman, D. R., Lee, T. W., Holtom, B. C., & Harman, W. S. (2009). Turnover contagion: How coworkers' job embeddedness and job search behaviors influence quitting. *Academy of Management Journal*, *52*(3), 545-561. [https://doi.org/10.5465/amj.2009.41331075](https://doi.org/10.5465/amj.2009.41331075)

<a id="field2021"></a>Field, J. G., Bosco, F. A., & Kepes, S. (2021). How robust is our cumulative knowledge on turnover? *Journal of Business and Psychology*, *36*(3), 349–365. [https://doi.org/10.1007/s10869-020-09687-3](https://doi.org/10.1007/s10869-020-09687-3)

<a id="fisher2021"></a>Fisher, P. A., Risavy, S. D., Robie, C., König, C. J., Christiansen, N. D., Tett, R. P., & Simonet, D. V. (2021). Selection myths: A conceptual replication of HR professionals' beliefs about effective human resource practices in the United States and Canada. *Journal of Personnel Psychology*, *20*(1), 51–60. [https://doi.org/10.1027/1866-5888/a000263](https://doi.org/10.1027/1866-5888/a000263)

<a id="griffeth2000"></a>Griffeth, R. W., Hom, P. W., & Gaertner, S. (2000). A meta-analysis of antecedents and correlates of employee turnover: Update, moderator tests, and research implications for the next millennium. *Journal of Management*, *26*(3), 463-488. [https://doi.org/10.1177/014920630002600305](https://doi.org/10.1177/014920630002600305)

<a id="guzzo2024"></a>Guzzo, R. A., & Castille, C. M. (2024). Translational science, open science, and accelerating practical impact. *The Industrial-Organizational Psychologist*, *61*(4). [https://www.siop.org/tip-article/translational-science-open-science-and-accelerating-practical-impact/](https://www.siop.org/tip-article/translational-science-open-science-and-accelerating-practical-impact/)

<a id="hoffman2021"></a>Hoffman, A. J. (2021). *The engaged scholar: Expanding the impact of academic research in today's world*. Stanford University Press. [https://www.sup.org/books/business/engaged-scholar](https://www.sup.org/books/business/engaged-scholar)

<a id="kreamer2024"></a>Kreamer, L. M., Cobb, H. R., Castille, C., & Cogswell, J. (2024). Big team science initiatives: A catalyst for trustworthy advancements in IO psychology. *Acta Psychologica*, *242*, 104101. [https://doi.org/10.1016/j.actpsy.2023.104101](https://doi.org/10.1016/j.actpsy.2023.104101)

<a id="hines2019"></a>Hines, S., Castille, C. M., & Castille, A. R. (2019). *Losing connections increases your flight risk: An examination of turnover contagion via social network analysis* [Unpublished manuscript].

<a id="hom2012"></a>Hom, P. W., Mitchell, T. R., Lee, T. W., & Griffeth, R. W. (2012). Reviewing employee turnover: Focusing on proximal withdrawal states and an expanded criterion. *Psychological Bulletin*, *138*(5), 831-858. [https://doi.org/10.1037/a0027983](https://doi.org/10.1037/a0027983)

<a id="latham1988"></a>Latham, G. P., Erez, M., & Locke, E. A. (1988). Resolving scientific disputes by the joint design of crucial experiments by the antagonists: Application to the Erez–Latham dispute regarding participation in goal setting. *Journal of Applied Psychology*, *73*(4), 753–772. [https://doi.org/10.1037/0021-9010.73.4.753](https://doi.org/10.1037/0021-9010.73.4.753)

<a id="liu2024"></a>Liu, Z., Hoff, K., Chu, C., Oswald, F. L., & Rounds, J. (2024). Toward whole-person fit assessment: Integrating interests, values, skills, knowledge, and personality using the Occupational Information Network (O*NET). *Journal of Applied Psychology*. [https://doi.org/10.1037/apl0001232](https://doi.org/10.1037/apl0001232)

<a id="mccartney2021"></a>McCartney, S., Murphy, C., & Mccarthy, J. (2021). 21st century HR: A competency model for the emerging role of HR Analysts. *Personnel Review*, *50*(6), 1495-1513. [https://doi.org/10.1108/PR-12-2019-0670](https://doi.org/10.1108/PR-12-2019-0670)

<a id="mollick2024"></a>Mollick, E. (2024). *Co-intelligence: Living and working with AI*. Penguin Random House. [https://www.penguinrandomhouse.com/books/741165/co-intelligence-by-ethan-mollick/](https://www.penguinrandomhouse.com/books/741165/co-intelligence-by-ethan-mollick/)

<a id="pittenger2005"></a>Pittenger, D. J. (2005). Cautionary comments regarding the Myers-Briggs Type Indicator. *Consulting Psychology Journal: Practice and Research*, *57*(3), 210–221. [https://doi.org/10.1037/1065-9293.57.3.210](https://doi.org/10.1037/1065-9293.57.3.210)

<a id="schlegel2019"></a>Schlegel, K., & Mortillaro, M. (2019). The Geneva Emotional Competence Test (GECo): An ability measure of workplace emotional intelligence. *Journal of Applied Psychology*, *104*(4), 559-580. [https://doi.org/10.1037/apl0000365](https://doi.org/10.1037/apl0000365)

<a id="schweitzer2004"></a>Schweitzer, M. E., Ordóñez, L., & Douma, B. (2004). Goal setting as a motivator of unethical behavior. *Academy of Management Journal*, *47*(3), 422-432. [https://doi.org/10.5465/20159596](https://doi.org/10.5465/20159596)

<a id="science2024"></a>Thorp, H. H., & Zewail, A. H. (2024). Accelerating science with AI. *Science*, *384*(6698), 825. [https://doi.org/10.1126/science.aee0605](https://doi.org/10.1126/science.aee0605)

<a id="sturman2001"></a>Sturman, M. C. (2001). Utility analysis for multiple selection devices and multiple outcomes. *Journal of Human Resource Costing & Accounting*, *6*(2), 9-28. [https://doi.org/10.1108/eb029072](https://doi.org/10.1108/eb029072)

<a id="sturman2003"></a>Sturman, M. C. (2003). Utility analysis: A tool for quantifying the value of hospitality human resource interventions. *Cornell Hotel and Restaurant Administration Quarterly*, *44*(2), 146-155. [Note: Full citation details to be confirmed]

<a id="sturman2012"></a>Sturman, M. C. (2012). Employee value: Combining utility analysis with strategic human resource management research to yield strong theory. In N. Schmitt (Ed.), *The Oxford Handbook of Personnel Assessment and Selection* (1st ed., pp. [pages]). Oxford University Press. [https://doi.org/10.1093/oxfordhb/9780199732579.001.0001](https://doi.org/10.1093/oxfordhb/9780199732579.001.0001)

<a id="sturman2023"></a>Sturman, M. C., Fan, X., & Shim, H. (2023). The theoretical value of understanding HRM's financial value. *The International Journal of Human Resource Management*, *34*(13), 2582–2594. [https://doi.org/10.1080/09585192.2023.2225282](https://doi.org/10.1080/09585192.2023.2225282)

<a id="simonet2020"></a>Simonet, D. V., & Castille, C. M. (2020). The search for meaningful work: A network analysis of personality and the job characteristics model. *Personality and Individual Differences*, *152*, 109569. [https://doi.org/10.1016/j.paid.2019.109569](https://doi.org/10.1016/j.paid.2019.109569)

<a id="stokes1997"></a>Stokes, D. E. (1997). *Pasteur's Quadrant: Basic Science and Technological Innovation*. Brookings Institution Press.

van der Laken, P. (2021, February 3). *People analytics vs HR analytics – Google Trends*. [https://paulvanderlaken.com/2021/02/03/people-analytics-hr-analytics-google-trends/](https://paulvanderlaken.com/2021/02/03/people-analytics-hr-analytics-google-trends/)

<a id="wang2016"></a>Wang, W., Newman, D. A., & Dipboye, R. L. (2016). Social network contagion in the job satisfaction-intention-turnover model. *Academy of Management Proceedings*, *2016*(1), 17930. [https://doi.org/10.5465/ambpp.2016.82](https://doi.org/10.5465/ambpp.2016.82)

<a id="williams2024"></a>Williams, L. J., Culpepper, S. A., & Castille, C. M. (in press). In defense of the RMSEA-P for latent variable model evaluation: A failed reproducibility study of Lance et al. (2016). *Journal of Management Scientific Reports*.

<a id="zimmerman2008"></a>Zimmerman, R. D. (2008). Understanding the impact of personality traits on individuals' turnover decisions: A meta-analytic path model. *Personnel Psychology*, *61*(2), 309-348. [https://doi.org/10.1111/j.1744-6570.2008.00115.x](https://doi.org/10.1111/j.1744-6570.2008.00115.x)

---

*Want to learn more? Explore our [research](/publication), connect with us on [LinkedIn](https://www.linkedin.com/in/christopher-castille/), or [get in touch](/contact).*
