---
# Display name
title: Christopher M. Castille

# Name pronunciation (optional)
name_pronunciation: ''

# Full name (for SEO)
first_name: Christopher
last_name: Castille

# Status emoji
status:
  icon: ☕️

# Is this the primary user of the site?
superuser: true

# Highlight the author in author lists? (true/false)
highlight_name: true

# Role/position/tagline
role: Assistant Professor of Management

# Organizations/Affiliations to display in Biography blox
organizations:
  - name: Nicholls State University
    url: https://www.nicholls.edu/management/faculty-staff/dr-chris-castille/

# Short bio (displayed in user profile at end of posts)
bio: My research interests include personality and individual differences in the workplace, organizational research methods, and open science practices.

# Social Networking
# Need to use another icon? Simply download the SVG icon to your `assets/media/icons/` folder.
profiles:
  - icon: at-symbol
    url: 'mailto:christopher.castille@nicholls.edu'
    label: E-mail Me
  - icon: brands/x
    url: https://twitter.com/cmcastille
  - icon: brands/github
    url: https://github.com/chriscastille
  - icon: brands/linkedin
    url: https://www.linkedin.com/in/christopher-castille
  - icon: academicons/google-scholar
    url: https://scholar.google.com/citations?user=PERSON-ID
  - icon: academicons/orcid
    url: https://orcid.org/

interests:
  - People Analytics
  - Personality in the Workplace
  - Open Science

education:
  - area: PhD Industrial/Organizational Psychology
    institution: Louisiana Tech University
    date_start: 2011-01-01
    date_end: 2015-12-31
    summary: |
      Dissertation on personality traits and workplace behavior.
    
  - area: MA Industrial/Organizational Psychology
    institution: Louisiana Tech University
    date_start: 2010-01-01
    date_end: 2012-12-31
    
  - area: BS Business Administration
    institution: Louisiana State University
    date_start: 2005-01-01
    date_end: 2008-12-31

work:
  - position: Assistant Professor of Management
    company_name: Nicholls State University
    company_url: 'https://www.nicholls.edu/'
    company_logo: ''
    date_start: 2015-08-01
    date_end: ''
    summary: |2-
      Responsibilities include:
      - Teaching undergraduate students in Human Relations and Interpersonal Skills (MNGT 370), Performance and Compensation Management (MNGT 475), and HR Analytics (MNGT 425), and teaching in the graduate (MBA) and Executive MBA programs where he teaches Managing Human Capital (MNGT 502)
      - Conducting research on personality and individual differences in workplace behavior
      - Co-directing the People Analytics Lab
      - Mentoring undergraduate and graduate students in research methods and open science practices

# Skills
# Add your own SVG icons to `assets/media/icons/`
skills:
  - name: Technical Skills
    items:
      - name: R
        description: 'Statistical analysis and data visualization'
        percent: 90
        icon: code-bracket
      - name: Python
        description: 'Data analysis and machine learning'
        percent: 70
        icon: code-bracket
      - name: SPSS
        description: 'Statistical software'
        percent: 85
        icon: chart-bar
        
  - name: Research Methods
    items:
      - name: Experimental Design
        description: ''
        percent: 95
        icon: person-simple-walk
      - name: Survey Research
        description: ''
        percent: 90
        icon: cat
      - name: Meta-Analysis
        description: ''
        percent: 80
        icon: camera

languages:
  - name: English
    percent: 100

# Awards.
#   Add/remove as many awards below as you like.
#   Only `title`, `awarder`, and `date` are required.
#   Begin multi-line `summary` with YAML's `|` or `|2-` multi-line prefix and indent 2 spaces below.
awards:
  - title: Top Research Honor
    url: https://www.nicholls.edu/news/2017/nicholls-professor-receives-top-research-honor-at-annual-management-conference/
    date: '2017-01-01'
    awarder: Annual Management Conference
    icon: ''
    summary: |
      Received top research honor for outstanding contribution to organizational research methods.
---

## About Me

Dr. Christopher M. Castille is the Director of the People Analytics Lab of the Bayou and the Gerald Gaston Endowed Associate Professor of Management at Nicholls State University. His research focuses on organizational behavior, workplace analytics, and human resource management. He is particularly interested in understanding how organizational practices impact employee performance and organizational effectiveness.

Dr. Castille earned his PhD in Industrial/Organizational Psychology from Louisiana Tech University and has published research on topics including workplace dynamics and employee engagement. He leads the lab's research initiatives and mentors students interested in organizational research and analytics.

---
# Leave the homepage title empty to use the site title
title: ""
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "6rem"

sections:
  - block: about.biography
    id: about
    content:
      title: Biography
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
  
  - block: skills
    content:
      title: Skills
      text: ''
      # Choose a user to display skills from (a folder name within `content/authors/`)
      username: admin
    design:
      columns: '1'
  
  - block: experience
    content:
      title: Experience
      # Date format for experience
      #   Refer to https://docs.hugoblox.com/customization/#date-format
      date_format: Jan 2006
      # Experiences.
      #   Add/remove as many `experience` items below as you like.
      #   Required fields are `title`, `company`, and `date_start`.
      #   Leave `date_end` empty if it's your current employer.
      #   Begin multi-line descriptions with YAML's `|2-` multi-line prefix.
      items:
        - title: Assistant Professor of Management
          company: Nicholls State University
          company_url: 'https://www.nicholls.edu/'
          company_logo: ''
          location: Thibodaux, Louisiana
          date_start: '2015-08-01'
          date_end: ''
          description: |2-
              * Teaching courses on Human Resource Management, HR Analytics, Managing Human Capital, Human Relations, and Performance and Compensation Management
              * Conducting research on personality and individual differences in workplace behavior
              * Co-directing the People Analytics Lab
              * Mentoring undergraduate and graduate students in research methods and open science practices
    design:
      columns: '2'
  
  - block: accomplishments
    content:
      title: 'Accomplish&shy;ments'
      subtitle:
      # Date format: https://docs.hugoblox.com/customization/#date-format
      date_format: Jan 2006
      # Accomplishments.
      #   Add/remove as many `item` blocks below as you like.
      #   `title`, `organization`, and `date_start` are the required parameters.
      #   Leave other parameters empty if not required.
      #   Begin multi-line descriptions with YAML's `|2-` multi-line prefix.
      items:
        - certificate_url: 'https://www.nicholls.edu/news/2017/nicholls-professor-receives-top-research-honor-at-annual-management-conference/'
          date_end: ''
          date_start: '2017-01-01'
          description: 'Received top research honor for outstanding contribution to organizational research methods'
          icon: ''
          organization: Annual Management Conference
          organization_url: ''
          title: Top Research Honor
          url: ''
    design:
      columns: '2'

  - block: collection
    id: posts
    content:
      title: Recent Posts
      subtitle: ''
      text: ''
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        folders:
          - post
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: compact
      columns: '2'

  - block: collection
    id: featured
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      columns: '2'
      view: card

  - block: collection
    content:
      title: Recent Publications
      text: |-
        Quickly discover relevant content by [filtering publications](./publication/).
      filters:
        folders:
          - publication
        exclude_featured: true
    design:
      columns: '2'
      view: citation

  - block: collection
    id: projects
    content:
      title: Projects
      subtitle: ''
      text: ''
      # Choose how many pages you would like to display (0 = all pages)
      count: 5
      # Filter on criteria
      filters:
        folders:
          - project
        author: ""
        category: ""
        tag: ""
        exclude_featured: false
        exclude_future: false
        exclude_past: false
        publication_type: ""
      # Choose how many pages you would like to offset by
      offset: 0
      # Page order: descending (desc) or ascending (asc) date.
      order: desc
    design:
      # Choose a layout view
      view: showcase
      columns: '2'

  - block: contact
    id: contact
    content:
      title: Contact
      subtitle:
      text: |-
        Feel free to reach out for collaboration opportunities, student inquiries, or questions about research.
      # Contact (add or remove contact options as necessary)
      email: christopher.castille@nicholls.edu
      phone: 985 449 7015
      appointment_url: 'https://calendly.com'
      address:
        street: 906 East 1st St., College of Business Administration
        city: Thibodaux
        region: LA
        postcode: '70301'
        country: United States
        country_code: US
      directions: Enter Building A and take the stairs to Office 200 on Floor 2
      office_hours:
        - 'Tuesday and Thursday 8-9AM, 10:30-12PM, 2-5PM'
        - 'Or email for appointment'
      # Choose a map provider in `params.yaml` to show a map from these coordinates
      coordinates:
        latitude: '29.7952'
        longitude: '-90.8226'  
      contact_links:
        - icon: twitter
          icon_pack: fab
          name: Twitter
          link: 'https://twitter.com/cmcastille'
        - icon: skype
          icon_pack: fab
          name: Skype Me
          link: 'skype:chris_castille?call'
        - icon: video
          icon_pack: fas
          name: Zoom Me
          link: 'https://zoom.us/'
      # Automatically link email and phone or display as text?
      autolink: true
    design:
      columns: '2'
--- 