#!/usr/bin/env bash

for file in chapters/*.markdown; do
	chapter_name=${file##*/}
	chapter_name=${chapter_name%.markdown}
	pandoc "$file" --template template.html --output "output/$chapter_name.html"
done