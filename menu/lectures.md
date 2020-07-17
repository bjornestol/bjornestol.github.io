---
layout: page
title: Forelesninger
---

<ul class = "posts">
{% for course in site.courses %}
    <li >
        <a href="{{ site.github.url }}{{ course.url }}"><h2>{{ course.code }} &mdash; {{ course.name }}</h2></a>
    </li>
{% endfor %}
</ul>
