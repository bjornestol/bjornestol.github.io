---
layout: page
title: Forelesninger
---
<h2>TRE1100 - Tretermin Matematikk</h2>
<p> Tretermin Matematikk er et kurs i matematikk for ingeniørstudenter som ikke har spesiell studiekompetanse med fordypning i matematikk og fysikk.
Forelesningsnotatene går gjennom boka <q>Sinus Forkurs</q>, delkapittel for delkapittel.
<ul class = "posts">
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
</ul>
