---
title: "Teaching Correlation Coefficients with Interactive Apps: A GenAI-Enhanced Approach"
authors:
  - admin
date: 2025-07-04T00:00:00Z
publishDate: 2025-07-04T00:00:00Z
publication_types: ["post"]
publication: ""
publication_short: ""
abstract: "How well can you spot the strength of relationships in data? This post explores my experimentation with Generative AI to create an interactive learning tool that makes correlation coefficients accessible and engaging for students."
summary: "An interactive web app for teaching correlation coefficients, developed through GenAI experimentation to enhance statistical education."
tags:
  - Teaching
  - Statistics
  - Interactive Learning
  - GenAI
  - Correlation
  - Educational Technology
featured: false
projects: []
slides: ""

url_pdf: ""
url_code: ""
url_dataset: ""
url_poster: ""
url_project: "https://christopher-m-castille.shinyapps.io/correlation-learning-app/"
url_slides: ""
url_source: ""
url_video: ""

image:
  caption: "Interactive correlation learning app interface"
  focal_point: ""
  preview_only: false

---

**I'm experimenting with Generative AI to become a more effective teacher.** This blog post shares one of those experiments: an interactive web application designed to help students develop an intuitive understanding of correlation coefficients through experiential learning. It – and the tool that I created – were done so with the help of [Cursor](https://cursor.sh), an AI-powered code editor that has been incredibly helpful for my development workflow. 

### How well can you spot the strength of relationships in data? 

This seemingly simple question reveals one of the fundamental challenges in teaching statistics: the gap between theoretical understanding and intuitive feel. As someone who teaches HR strategy and analytics, I've found that the concept of a correlation—while mathematically straightforward—can be surprisingly difficult for students to grasp intuitively. So I've created a tool to help them get some practice. Sometimes the effects they think are obvious are surprisingly small while others are much larger than anticipated.

### The Challenge of Teaching the Concept of a Correlation

Correlation coefficients are deceptively simple. The math is straightforward: a value between -1 and +1 that measures the strength and direction of a linear relationship. But ask students to look at a scatter plot and estimate the correlation, and you'll often see wildly different guesses. Why is this?

The answer lies in the difference between knowing and feeling. Students can memorize that r = 0.3 represents a "moderate" correlation, but without repeated exposure to visual patterns, they lack the intuitive sense of what that actually looks like in data. This gap becomes particularly problematic when they need to interpret research findings or communicate statistical concepts to non-technical audiences. In practice, meaningful correlations are often small, reflecting underlying causes that may not yet be clearly understood.

### Getting this Intuitive Feeling About Correlations

Enter the "Guess the Correlation" app—a web-based interactive tool that transforms abstract statistical concepts into hands-on learning experiences. The app presents users with scatter plots and asks them to estimate the correlation coefficient, providing immediate feedback and educational explanations. I was inspired by Daniel Läkens, a social psychologist who created a similar game (who I'm sure was inspired by this [game](https://www.guessthecorrelation.com)).

**[🎯 Try the app now!](https://christopher-m-castille.shinyapps.io/correlation-learning-app/)**

![Correlation Learning App Main Interface](/img/correlation-app/main_interface.png)

To use the app, select the correlation coefficient (r) that represents your best guess for the relationship between the two variables using the slider. Then, click “Generate Plot” to visualize how your chosen correlation would look in the data. You can explore how different values of r change the scatterplot. When you’re ready to see how your guess compares to the actual research finding, click “Submit for Feedback.” The app will show you the correct answer and provide an explanation, helping you build intuition for what different correlations look like in real data (which can also be downloaded by interested students). The app provides immediate feedback on guesses, showing the actual correlation and explaining the relationship. This instant reinforcement helps students develop an intuitive understanding of what different correlation values look like in practice.

The app proceeds in a few phases with the first one generating obvious and intuitive examples. Then come a few non-intuitive examples that may be surprising. Later, I draw on examples from the psychological assessment literature, drawing on work by Meyer et al. (2001) that highlights the predictive power of psychological testing.

![Phase 1: Intuitive Examples](/img/correlation-app/phase1_height_weight.png)

![Feedback and Scoring System](/img/correlation-app/feedback_scoring.png)

Meyer et al. (2001) surveyed hundreds of both real world effects (e.g., the correlation linking batting averages to getting a hit on base) and psychological assessment studies (e.g., the correlation linking hiring interviews to future job performance). Sometimes these effects were not in the metric of a correlation coefficient and had to be converted into that metric. This helps people to see correlations in 'real life' real-world associations that most anyone can relate to. For example, Meyer et al. compiled research showing that conscientiousness personality tests correlate only 0.23 with job performance, while integrity tests correlate 0.27 with supervisory ratings. I find that student guesses can be wildly offbase here. They either think both test are not at all predictive of future performance (because people will lie on these test) or think that psychology is so powerful as to trump other factors. Fortunately, looking at the data can be a moment for humility. These findings help students understand that meaningful workplace relationships are often surprisingly modest in magnitude.

I programmed the app uses the Binomial Effect Size Display (BESD) method (Rosenthal & Rubin, 1982) for effect size interpretation, helping students understand the practical significance of correlations beyond just the numerical value. BESD translates correlation coefficients into more intuitive language by showing how the relationship affects success rates. For instance, a correlation of **0.67** means that if you split people into high and low groups on the predictor variable, **68.5%** of the high group will be above average on the outcome, compared to only **35%** of the low group. This makes abstract statistical concepts concrete and meaningful for business decision-making.

![BESD Visualization](/img/correlation-app/besd_visualization.png)

I was deliberate in choosing the BESD. Although we do our best to help business professionals appreciate the value of a correlation coefficient, it is quite common for professionals in practice to want associations depicted as a bar chart. Indeed, research by Brooks et al. (2014) demonstrates that managers and practitioners find common language effect sizes like BESD significantly easier to understand than traditional effect size measures like correlation coefficients, making this approach particularly valuable for students who will communicate research findings to business audiences.

## Future Directions

One reason why I built this app is to help my studnets move a little closer toward understanding how to speak about the power of interventions in organizational settings. I'm speaking to an old literature here referring to utility analysis, which is my field's best effort at positioning HR interventions as investments that are comparable to tangible forms of investments (e.g., new buildings, equipment)...but that is for another blog post. 

**[Try the app yourself](https://christopher-m-castille.shinyapps.io/correlation-learning-app/)** and see how quickly you develop an intuitive feel for correlation coefficients. Share it with your students, colleagues, or anyone interested in understanding data relationships better. The app is designed to be accessible to everyone, regardless of their statistical background.

This project represents just one step in my ongoing exploration of AI-assisted teaching methods. The goal is not to replace traditional teaching but to enhance it with tools that make complex concepts more approachable and engaging.

---

**References:**

Brooks, M. E., Dalal, D. K., & Nolan, K. P. (2014). Are common language effect sizes easier to understand than traditional effect sizes? *Journal of Applied Psychology*, 99(2), 332–340. https://doi.org/10.1037/a0034745

Erez, A., & Grant, A. M. (2014). Separating data from intuition: Bringing evidence into the management classroom. *Academy of Management Learning & Education*, 13(3), 295-311. https://faculty.wharton.upenn.edu/wp-content/uploads/2014/01/ErezGrant_AMLEforthcoming_5.pdf

Meyer, G. J., Finn, S. E., Eyde, L. D., Kay, G. G., Moreland, K. L., Dies, R. R., Eisman, E. J., Kubiszyn, T. W., & Reed, G. M. (2001). Psychological testing and psychological assessment: A review of evidence and issues. *American Psychologist*, 56(2), 128–165. https://doi.org/10.1037/0003-066X.56.2.128

Rosenthal, R., & Rubin, D. B. (1982). A simple, general purpose display of magnitude of experimental effect. *Journal of Educational Psychology*, 74(2), 166–169. https://doi.org/10.1037/0022-0663.74.2.166

---

*This blog post demonstrates how AI can enhance teaching effectiveness by creating interactive, accessible learning tools that make complex concepts approachable for everyone.* 