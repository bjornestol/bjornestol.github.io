---
layout: page
title: Forelesninger
---
<ul class="posts">
  {% for lecture in site.lectures %}
    <li itemscope>
      <a href="{{ site.github.url }}{{ lecture.url }}">{{ lecture.title }}</a>
    </li>
  {% endfor %}
</ul>
