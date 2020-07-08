---
layout: page
title: Forelesninger
---
<h2>TRE1100 - Tretermin Matematikk</h2>
{% for chapter in site.data.TRE1100.chapters %}
  <h3>{{ chapter.title }}</h3>
  <ul>    
    {% for lecture in site.lectures %}
      {% if lecture.chapter == chapter.number %}
        <li itemscope>
          <a href="{{ site.github.url }}{{ lecture.url }}">{{ lecture.title }}</a>
        </li>
      {% endif %}
    {% endfor %}
  </ul>
{% endfor %}
